import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const { event_type, payload, timestamp } = event;

    if (!event_type || !payload) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'automation',
      actor_id: 'webhook',
      action: event_type,
      entity: payload.entity || 'system',
      entity_id: payload.entity_id || payload.trip_id || 'unknown',
      after: payload,
      timestamp: timestamp || new Date().toISOString(),
    });

    switch (event_type) {
      case 'ai.draft.ready':
        if (payload.trip_id) {
          await supabase.from('trips').update({
            status: 'human_review',
            updated_at: new Date().toISOString(),
          }).eq('id', payload.trip_id);
        }
        break;

      case 'status.changed':
        if (payload.entity_id && payload.new_status) {
          await supabase.from('trips').update({
            status: payload.new_status,
            updated_at: new Date().toISOString(),
          }).eq('id', payload.entity_id);
        }
        break;

      case 'agent.failed':
        if (payload.run_id) {
          await supabase.from('ai_runs').update({
            status: 'failed',
            ended_at: new Date().toISOString(),
          }).eq('id', payload.run_id);
        }
        break;
    }

    return NextResponse.json({ received: true, event_id: uuidv4() });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
