'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabase';
import type { Trip, TripStatus } from '@/types';
import { TRIP_TYPE_LABELS } from '@/lib/constants';

export default function LeadsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let query = supabase.from('trips').select('*, customer:customers(*)').order('created_at', { ascending: false });
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      const { data } = await query;
      if (data) setTrips(data as unknown as Trip[]);
      setLoading(false);
    }
    load();
  }, [filter]);

  const statusFilters = [
    { value: 'all', label: 'הכל' },
    { value: 'new_lead', label: 'חדשים' },
    { value: 'questionnaire_completed', label: 'שאלון הושלם' },
    { value: 'human_review', label: 'ממתין לאישור' },
    { value: 'proposal_sent', label: 'הצעה נשלחה' },
    { value: 'customer_selected_option', label: 'לקוח בחר' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#102A43] mb-8">ניהול לידים</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setLoading(true); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${filter === f.value ? 'bg-[#102A43] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse text-gray-500">טוען...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-right py-3 px-2 font-medium">שם</th>
                  <th className="text-right py-3 px-2 font-medium">מייל</th>
                  <th className="text-right py-3 px-2 font-medium">טלפון</th>
                  <th className="text-right py-3 px-2 font-medium">יעד</th>
                  <th className="text-right py-3 px-2 font-medium">סוג</th>
                  <th className="text-right py-3 px-2 font-medium">סטטוס</th>
                  <th className="text-right py-3 px-2 font-medium">תאריך</th>
                  <th className="text-right py-3 px-2 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{trip.customer?.name || '—'}</td>
                    <td className="py-3 px-2 text-gray-600" dir="ltr">{trip.customer?.email || '—'}</td>
                    <td className="py-3 px-2 text-gray-600" dir="ltr">{trip.customer?.phone || '—'}</td>
                    <td className="py-3 px-2">{trip.destination || 'לא צוין'}</td>
                    <td className="py-3 px-2">{TRIP_TYPE_LABELS[trip.trip_type] || trip.trip_type}</td>
                    <td className="py-3 px-2"><StatusBadge status={trip.status as TripStatus} /></td>
                    <td className="py-3 px-2 text-gray-500">{new Date(trip.created_at).toLocaleDateString('he-IL')}</td>
                    <td className="py-3 px-2">
                      <Link href={`/admin/leads/${trip.id}`} className="text-[#21C7B7] hover:underline text-xs">
                        פתח
                      </Link>
                    </td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">אין לידים</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
