'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Proposal, Trip, Customer } from '@/types';
import { supabase } from '@/lib/supabase';

export default function ProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [trip, setTrip] = useState<(Trip & { customer: Customer }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('proposals').select('*').eq('id', proposalId).single();
      if (p) {
        setProposal(p as unknown as Proposal);
        const { data: t } = await supabase.from('trips').select('*, customer:customers(*)').eq('id', p.trip_id).single();
        if (t) setTrip(t as unknown as Trip & { customer: Customer });
      }
      setLoading(false);
    }
    load();
  }, [proposalId]);

  async function handleSelect(optionId: string) {
    setSelecting(true);
    setSelectedOption(optionId);
    try {
      await fetch(`/api/proposals/${proposalId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: optionId }),
      });
      router.push(`/status/${trip?.id}?selected=true`);
    } catch {
      alert('שגיאה בבחירת חלופה');
    } finally {
      setSelecting(false);
    }
  }

  async function handleMeetingRequest() {
    setSelecting(true);
    try {
      await fetch(`/api/proposals/${proposalId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: 'meeting_request' }),
      });
      router.push(`/status/${trip?.id}?meeting=true`);
    } catch {
      alert('שגיאה בבקשת פגישה');
    } finally {
      setSelecting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">טוען הצעה...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!proposal) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card>
              <h2 className="text-xl font-bold mb-4">ההצעה לא נמצאה</h2>
              <p className="text-gray-600">בדקו את הלינק שקיבלתם במייל.</p>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const optionColors = ['border-green-300 bg-green-50', 'border-[#21C7B7] bg-teal-50', 'border-orange-300 bg-orange-50'];
  const optionLabels = ['חסכונית', 'מאוזנת (מומלצת)', 'נוחה / פרימיום'];

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-bl from-[#102A43] to-[#1a3a5c] text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              הצעת טיול מותאמת אישית
              {trip?.destination && <span className="text-[#21C7B7]"> ל{trip.destination}</span>}
            </h1>
            {trip?.customer && (
              <p className="text-gray-300 text-lg">
                שלום {trip.customer.name}, הכנו עבורכם 3 חלופות
              </p>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {proposal.customer_profile_summary && (
            <Card className="mb-8 bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-[#102A43] mb-2">הבנו אתכם</h3>
              <p className="text-gray-700 text-sm">{proposal.customer_profile_summary}</p>
            </Card>
          )}

          <h2 className="text-2xl font-bold text-[#102A43] mb-6">3 חלופות לבחירה</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {proposal.options?.map((option, i) => (
              <Card key={option.option_id} className={`border-2 ${optionColors[i] || ''} ${i === 1 ? 'ring-2 ring-[#21C7B7]' : ''}`} hover>
                <div className="text-center mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${i === 1 ? 'bg-[#21C7B7] text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {optionLabels[i]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#102A43] text-center mb-2">{option.title}</h3>
                <p className="text-sm text-gray-600 text-center mb-4">{option.description}</p>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-[#102A43]">
                    {option.estimated_price.currency === 'EUR' ? '€' : option.estimated_price.currency === 'USD' ? '$' : '₪'}
                    {option.estimated_price.amount.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">מחיר משוער • תאריך בדיקה: {new Date(option.estimated_price.checked_at).toLocaleDateString('he-IL')}</p>
                </div>
                {option.pros.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">יתרונות:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {option.pros.map((pro, j) => <li key={j}>+ {pro}</li>)}
                    </ul>
                  </div>
                )}
                {option.cons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-red-700 mb-1">חסרונות:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {option.cons.map((con, j) => <li key={j}>- {con}</li>)}
                    </ul>
                  </div>
                )}
                <Button
                  className="w-full"
                  variant={i === 1 ? 'primary' : 'secondary'}
                  onClick={() => handleSelect(option.option_id)}
                  loading={selecting && selectedOption === option.option_id}
                  disabled={selecting}
                >
                  בחירת חלופה
                </Button>
              </Card>
            ))}
          </div>

          {proposal.itinerary && proposal.itinerary.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">מסלול יומי</h2>
              <div className="space-y-4">
                {proposal.itinerary.map((day) => (
                  <Card key={day.day}>
                    <h3 className="font-bold text-[#102A43] mb-3">יום {day.day}: {day.title}</h3>
                    <div className="space-y-2">
                      {day.items.map((item, j) => (
                        <div key={j} className="flex gap-3 text-sm">
                          <span className="text-[#21C7B7] font-mono min-w-[50px]">{item.time}</span>
                          <div>
                            <span className="text-gray-700">{item.activity}</span>
                            {item.note && <span className="text-gray-400 text-xs block">{item.note}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {proposal.checklist && proposal.checklist.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">צ׳ק-ליסט לפני טיסה</h2>
              <Card>
                <div className="space-y-3">
                  {proposal.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
                      <span className="text-sm text-gray-700 flex-1">{item.task}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.priority === 'high' ? 'bg-red-100 text-red-700' : item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.priority === 'high' ? 'דחוף' : item.priority === 'medium' ? 'בינוני' : 'רגיל'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          <Card className="text-center bg-[#102A43] text-white">
            <h3 className="text-xl font-bold mb-3">רוצים לדבר עם נציג?</h3>
            <p className="text-gray-300 mb-6 text-sm">אפשר לקבוע שיחת ייעוץ קצרה — נשמח לעזור</p>
            <Button variant="primary" size="lg" onClick={handleMeetingRequest} loading={selecting && selectedOption === null} disabled={selecting}>
              קבעו שיחה
            </Button>
          </Card>

          <div className="mt-8 text-center text-xs text-gray-400">
            <p>מחירים משוערים בלבד ועשויים להשתנות. לא נבצע הזמנה או תשלום ללא אישורך.</p>
            <p>כל המלצה כוללת מקור ותאריך בדיקה.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
