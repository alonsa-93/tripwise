'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import type { AIRun } from '@/types';

const AGENT_LABELS: Record<string, string> = {
  orchestrator: 'Orchestrator',
  profile_analyzer: 'Profile Analyzer',
  research: 'Research Agent',
  attractions: 'Attractions Agent',
  flights: 'Flights Agent',
  hotels: 'Hotels Agent',
  itinerary: 'Itinerary Agent',
  checklist: 'Checklist Agent',
  qa: 'QA Agent',
  proposal_writer: 'Proposal Writer',
  sales_summary: 'Sales Summary',
  miro_docs: 'Miro Documentation',
};

export default function AgentsPage() {
  const [runs, setRuns] = useState<AIRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('ai_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);
      if (data) setRuns(data as unknown as AIRun[]);
      setLoading(false);
    }
    load();
  }, []);

  const statusColors: Record<string, string> = {
    running: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  if (loading) return <div className="animate-pulse text-gray-500">טוען...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#102A43] mb-8">דשבורד סוכנים</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(AGENT_LABELS).slice(0, 8).map(([key, label]) => {
          const agentRuns = runs.filter((r) => r.agent_name === key);
          const completed = agentRuns.filter((r) => r.status === 'completed').length;
          const failed = agentRuns.filter((r) => r.status === 'failed').length;
          return (
            <Card key={key} hover>
              <div className="text-sm font-medium text-[#102A43] mb-2">{label}</div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="text-green-600">{completed} הצליחו</span>
                <span className="text-red-600">{failed} נכשלו</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="text-lg font-bold text-[#102A43] mb-4">ריצות אחרונות</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-right py-3 px-2 font-medium">סוכן</th>
                <th className="text-right py-3 px-2 font-medium">סטטוס</th>
                <th className="text-right py-3 px-2 font-medium">טיול</th>
                <th className="text-right py-3 px-2 font-medium">עלות</th>
                <th className="text-right py-3 px-2 font-medium">התחלה</th>
                <th className="text-right py-3 px-2 font-medium">סיום</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{AGENT_LABELS[run.agent_name] || run.agent_name}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[run.status] || ''}`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-mono text-xs">{run.trip_id.slice(0, 8)}...</td>
                  <td className="py-3 px-2">{run.cost ? `$${run.cost.toFixed(4)}` : '—'}</td>
                  <td className="py-3 px-2 text-gray-500">{new Date(run.started_at).toLocaleString('he-IL')}</td>
                  <td className="py-3 px-2 text-gray-500">{run.ended_at ? new Date(run.ended_at).toLocaleString('he-IL') : '—'}</td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">אין ריצות עדיין</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
