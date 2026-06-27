'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase } from '@/lib/supabase';
import type { Trip, TripStatus } from '@/types';

interface DashboardStats {
  total: number;
  newLeads: number;
  inProgress: number;
  pendingReview: number;
  sent: number;
  closed: number;
}

export default function AdminDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, newLeads: 0, inProgress: 0, pendingReview: 0, sent: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('trips')
        .select('*, customer:customers(*)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        const tripsData = data as unknown as Trip[];
        setTrips(tripsData);
        setStats({
          total: tripsData.length,
          newLeads: tripsData.filter((t) => t.status === 'new_lead').length,
          inProgress: tripsData.filter((t) => ['questionnaire_sent', 'questionnaire_completed', 'ai_researching'].includes(t.status)).length,
          pendingReview: tripsData.filter((t) => ['ai_draft_ready', 'human_review'].includes(t.status)).length,
          sent: tripsData.filter((t) => ['proposal_sent', 'customer_selected_option', 'meeting_scheduled'].includes(t.status)).length,
          closed: tripsData.filter((t) => ['closed_won', 'closed_lost'].includes(t.status)).length,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'סה״כ לידים', value: stats.total, color: 'bg-blue-50 text-blue-700' },
    { label: 'לידים חדשים', value: stats.newLeads, color: 'bg-green-50 text-green-700' },
    { label: 'בתהליך', value: stats.inProgress, color: 'bg-purple-50 text-purple-700' },
    { label: 'ממתינים לאישור', value: stats.pendingReview, color: 'bg-orange-50 text-orange-700' },
    { label: 'הצעות נשלחו', value: stats.sent, color: 'bg-teal-50 text-teal-700' },
    { label: 'נסגרו', value: stats.closed, color: 'bg-gray-50 text-gray-700' },
  ];

  if (loading) {
    return <div className="animate-pulse text-gray-500">טוען...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#102A43] mb-8">דשבורד ראשי</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`${stat.color} border-0`}>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#102A43]">לידים אחרונים</h2>
          <Link href="/admin/leads" className="text-sm text-[#21C7B7] hover:underline">
            הצג הכל
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-right py-3 px-2 font-medium">שם</th>
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
                  <td className="py-3 px-2">{trip.destination || 'לא צוין'}</td>
                  <td className="py-3 px-2">{trip.trip_type}</td>
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
                  <td colSpan={6} className="py-8 text-center text-gray-500">אין לידים עדיין</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
