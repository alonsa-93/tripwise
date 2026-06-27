'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { TRIP_TYPE_LABELS } from '@/lib/constants';
import type { Trip, Customer, Questionnaire, Proposal, AuditLog, TripStatus } from '@/types';

export default function LeadDetailPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<(Trip & { customer: Customer }) | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [tripRes, qRes, propRes, logRes] = await Promise.all([
        supabase.from('trips').select('*, customer:customers(*)').eq('id', tripId).single(),
        supabase.from('questionnaires').select('*').eq('trip_id', tripId).order('version', { ascending: false }).limit(1),
        supabase.from('proposals').select('*').eq('trip_id', tripId).order('version', { ascending: false }),
        supabase.from('audit_logs').select('*').eq('entity_id', tripId).order('timestamp', { ascending: false }).limit(20),
      ]);

      if (tripRes.data) setTrip(tripRes.data as unknown as Trip & { customer: Customer });
      if (qRes.data?.[0]) setQuestionnaire(qRes.data[0] as unknown as Questionnaire);
      if (propRes.data) setProposals(propRes.data as unknown as Proposal[]);
      if (logRes.data) setAuditLogs(logRes.data as unknown as AuditLog[]);
      setLoading(false);
    }
    load();
  }, [tripId]);

  async function updateStatus(newStatus: TripStatus) {
    await supabase.from('trips').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', tripId);
    setTrip((prev) => prev ? { ...prev, status: newStatus } : prev);
  }

  if (loading) return <div className="animate-pulse text-gray-500">טוען...</div>;
  if (!trip) return <div className="text-gray-500">ליד לא נמצא</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/leads" className="text-sm text-gray-500 hover:text-[#102A43] mb-2 inline-block">← חזרה לרשימה</Link>
          <h1 className="text-2xl font-bold text-[#102A43]">
            {trip.customer?.name}
            <StatusBadge status={trip.status as TripStatus} />
          </h1>
        </div>
        <div className="flex gap-2">
          {trip.status === 'human_review' && (
            <>
              <Button size="sm" onClick={() => updateStatus('approved')}>אישור הצעה</Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus('needs_ai_fix')}>החזר לתיקון</Button>
            </>
          )}
          {trip.status === 'new_lead' && (
            <Button size="sm" variant="secondary" onClick={() => updateStatus('questionnaire_sent')}>סמן שאלון נשלח</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">פרטי לקוח</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">שם:</span> {trip.customer?.name}</div>
              <div><span className="text-gray-500">מייל:</span> <span dir="ltr">{trip.customer?.email}</span></div>
              <div><span className="text-gray-500">טלפון:</span> <span dir="ltr">{trip.customer?.phone}</span></div>
              <div><span className="text-gray-500">הסכמה שיווקית:</span> {trip.customer?.marketing_consent ? 'כן' : 'לא'}</div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">פרטי טיול</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">יעד:</span> {trip.destination || 'לא צוין'}</div>
              <div><span className="text-gray-500">סוג:</span> {TRIP_TYPE_LABELS[trip.trip_type]}</div>
              <div><span className="text-gray-500">נוסעים:</span> {trip.travelers_adults} מבוגרים, {trip.travelers_children} ילדים</div>
              <div><span className="text-gray-500">תקציב:</span> {trip.budget || 'לא צוין'}</div>
              <div><span className="text-gray-500">תאריכים:</span> {trip.departure_date || 'לא צוין'} — {trip.return_date || 'לא צוין'}</div>
              {trip.children_ages && trip.children_ages.length > 0 && (
                <div><span className="text-gray-500">גילאי ילדים:</span> {trip.children_ages.join(', ')}</div>
              )}
            </div>
          </Card>

          {questionnaire && (
            <Card>
              <h3 className="font-bold text-[#102A43] mb-4">שאלון אפיון</h3>
              <pre className="text-xs bg-gray-50 p-4 rounded-xl overflow-auto max-h-64" dir="ltr">
                {JSON.stringify(questionnaire.answers_json, null, 2)}
              </pre>
              <p className="text-xs text-gray-500 mt-2">הוגש: {questionnaire.submitted_at ? new Date(questionnaire.submitted_at).toLocaleString('he-IL') : '—'}</p>
            </Card>
          )}

          {proposals.length > 0 && (
            <Card>
              <h3 className="font-bold text-[#102A43] mb-4">הצעות</h3>
              {proposals.map((p) => (
                <div key={p.id} className="border rounded-xl p-4 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">גרסה {p.version}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'approved' ? 'bg-green-100 text-green-700' : p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{p.options?.length || 0} חלופות</p>
                  {p.qa_warnings && p.qa_warnings.length > 0 && (
                    <div className="mt-2 text-xs text-orange-600">
                      אזהרות QA: {p.qa_warnings.join(', ')}
                    </div>
                  )}
                  {trip.status === 'human_review' && (
                    <Link href={`/admin/review/${p.id}`} className="text-sm text-[#21C7B7] hover:underline mt-2 inline-block">
                      פתח לבדיקה
                    </Link>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">היסטוריית אירועים</h3>
            <div className="space-y-3 max-h-96 overflow-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="text-xs border-b pb-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-gray-400">{new Date(log.timestamp).toLocaleString('he-IL')}</span>
                  </div>
                  <div className="text-gray-500">{log.actor_type} • {log.actor_id}</div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-gray-400 text-sm">אין אירועים</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-[#102A43] mb-4">פעולות מהירות</h3>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => updateStatus('ai_researching')}>
                הפעל חיפוש AI
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={() => updateStatus('closed_won')}>
                סגור כהצלחה
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-red-600" onClick={() => updateStatus('closed_lost')}>
                סגור ללא הצלחה
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
