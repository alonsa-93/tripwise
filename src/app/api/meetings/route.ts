import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { emitEvent } from '@/lib/automation-adapter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { trip_id, selected_slot } = await request.json();

    if (!trip_id || !selected_slot) {
      return NextResponse.json({ error: 'חסרים נתונים' }, { status: 400 });
    }

    const slotId = uuidv4();
    const { error } = await supabase.from('meeting_slots').insert({
      id: slotId,
      trip_id,
      proposed_slots: [],
      selected_slot,
      status: 'selected',
    });

    if (error) {
      console.error('Meeting slot error:', error);
      return NextResponse.json({ error: 'שגיאה בקביעת פגישה' }, { status: 500 });
    }

    await supabase.from('trips').update({
      status: 'meeting_scheduled',
      updated_at: new Date().toISOString(),
    }).eq('id', trip_id);

    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'user',
      actor_id: 'customer',
      action: 'meeting.scheduled',
      entity: 'meeting_slot',
      entity_id: slotId,
      after: { trip_id, selected_slot },
      timestamp: new Date().toISOString(),
    });

    await emitEvent('meeting.slot.selected', {
      trip_id,
      slot_id: slotId,
    });

    return NextResponse.json({ success: true, slot_id: slotId });
  } catch (error) {
    console.error('Meeting scheduling failed:', error);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
