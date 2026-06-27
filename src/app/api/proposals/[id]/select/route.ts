import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { emitEvent } from '@/lib/automation-adapter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: proposalId } = await params;
    const { option_id } = await request.json();

    const supabase = getServiceClient();
    const { data: proposal } = await supabase.from('proposals').select('*').eq('id', proposalId).single();
    if (!proposal) {
      return NextResponse.json({ error: 'הצעה לא נמצאה' }, { status: 404 });
    }

    const isMeetingRequest = option_id === 'meeting_request';
    const newStatus = isMeetingRequest ? 'sales_call_needed' : 'customer_selected_option';

    await supabase.from('trips').update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    }).eq('id', proposal.trip_id);

    await supabase.from('proposals').update({
      status: 'selected',
    }).eq('id', proposalId);

    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'user',
      actor_id: 'customer',
      action: isMeetingRequest ? 'meeting.requested' : 'option.selected',
      entity: 'proposal',
      entity_id: proposalId,
      after: { option_id, trip_id: proposal.trip_id },
      timestamp: new Date().toISOString(),
    });

    if (isMeetingRequest) {
      await emitEvent('meeting.slot.selected', {
        trip_id: proposal.trip_id,
        slot_id: 'pending',
      });
    } else {
      await emitEvent('customer.option.selected', {
        trip_id: proposal.trip_id,
        option_id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Selection failed:', error);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
