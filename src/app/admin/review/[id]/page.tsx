'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { emitEvent } from '@/lib/automation-adapter';
import type { Proposal, Trip, Customer, Source } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [trip, setTrip] = useState<(Trip & { customer: Customer }) | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixNote, setFixNote] = useState('');

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('proposals').select('*').eq('id', proposalId).single();
      if (p) {
        setProposal(p as unknown as Proposal);
        const [tripRes, sourcesRes] = await Promise.all([
          supabase.from('trips').select('*, customer:customers(*)').eq('id', p.trip_id).single(),
          supabase.from('sources').select('*').eq('trip_id', p.trip_id),
        ]);
        if (tripRes.data) setTrip(tripRes.data as unknown as Trip & { customer: Customer });
        if (sourcesRes.data) setSources(sourcesRes.data as unknown as Source[]);
      }
      setLoading(false);
    }
    load();
  }, [proposalId]);

  async function handleApprove() {
    if (!proposal || !trip) return;
    await supabase.from('proposals').update({ status: 'approved', approved_by: 'admin', approved_at: new Date().toISOString() }).eq('id', proposalId);
    await supabase.from('trips').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', trip.id);
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'user',
      actor_id: 'admin',
      action: 'proposal.approved',
      entity: 'proposal',
      entity_id: proposalId,
      after: { trip_id: trip.id },
      timestamp: new Date().toISOString(),
    });
    await emitEvent('proposal.approved', { trip_id: trip.id, approved_by: 'admin' });
    router.push(`/admin/leads/${trip.id}`);
  }

  async function handleReturnForFix() {
    if (!proposal || !trip || !fixNote) return;
    await supabase.from('trips').update({ status: 'needs_ai_fix', updated_at: new Date().toISOString() }).eq('id', trip.id);
    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'user',
      actor_id: 'admin',
      action: 'proposal.returned_for_fix',
      entity: 'proposal',
      entity_id: proposalId,
      after: { reason: fixNote, trip_id: trip.id },
      timestamp: new Date().toISOString(),
    });
    router.push(`/admin/leads/${trip.id}`);
  }

  if (loading) return <div className="animate-pulse text-gray-500">טוען...</div>;
  if (!proposal || !trip) return <div className="text-gray-500">הצעה לא נמצאה</div>;

  return (
    <div>
      <Link href={`/admin/leads/${trip.id}`} className="text-sm text-gray-500 hover:text-[#102A43] mb-4 inline-block">
        ← חזרה לכרטיס לקוח
      </Link>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#102A43]">
          בדיקת הצעה — {trip.customer?.name}
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleApprove}>אישור ושליחה</Button>
          <Button variant="outline" onClick={handleReturnForFix} disabled={!fixNote}>החזר לתיקון</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {proposal.qa_warnings && proposal.qa_warnings.length > 0 && (
            <Card className="bg-orange-50 border border-orange-200">
              <h3 className="font-bold text-orange-800 mb-2">אזהרות QA</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                {proposal.qa_warnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </Card>
          )}

          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">סיכום פרופיל</h3>
            <p className="text-gray-700">{proposal.customer_profile_summary || 'לא זמין'}</p>
          </Card>

          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">חלופות</h3>
            {proposal.options?.map((option, i) => (
              <div key={option.option_id} className="border rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">{option.title}</h4>
                  <span className="font-bold text-[#102A43]">
                    {option.estimated_price.currency} {option.estimated_price.amount.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-green-600">יתרונות: {option.pros.join(', ') || 'אין'}</div>
                  <div className="text-red-600">חסרונות: {option.cons.join(', ') || 'אין'}</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Fit score: {(option.fit_score * 100).toFixed(0)}% |
                  נבדק: {new Date(option.estimated_price.checked_at).toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
          </Card>

          {proposal.itinerary && proposal.itinerary.length > 0 && (
            <Card>
              <h3 className="font-bold text-[#102A43] mb-4">מסלול יומי</h3>
              {proposal.itinerary.map((day) => (
                <div key={day.day} className="mb-4">
                  <h4 className="font-medium mb-2">יום {day.day}: {day.title}</h4>
                  <div className="space-y-1 text-sm">
                    {day.items.map((item, j) => (
                      <div key={j} className="flex gap-2">
                        <span className="text-[#21C7B7] font-mono min-w-[50px]">{item.time}</span>
                        <span>{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">מקורות ({sources.length})</h3>
            <div className="space-y-2 max-h-64 overflow-auto">
              {sources.map((s) => (
                <div key={s.id} className="text-xs border-b pb-2">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#21C7B7] hover:underline">{s.source_name}</a>
                  <div className="text-gray-500">
                    <span className={`px-1 rounded ${s.confidence === 'high' ? 'text-green-600' : s.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {s.confidence}
                    </span>
                    • {new Date(s.checked_at).toLocaleDateString('he-IL')}
                  </div>
                </div>
              ))}
              {sources.length === 0 && <p className="text-gray-400 text-sm">אין מקורות</p>}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">החזרה לתיקון</h3>
            <textarea
              value={fixNote}
              onChange={(e) => setFixNote(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none resize-none text-sm mb-3"
              placeholder="מה צריך לתקן?"
            />
            <Button variant="outline" size="sm" className="w-full" onClick={handleReturnForFix} disabled={!fixNote}>
              החזר לתיקון AI
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
