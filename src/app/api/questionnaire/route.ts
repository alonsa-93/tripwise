import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { emitEvent } from '@/lib/automation-adapter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { trip_id, answers } = await request.json();

    if (!trip_id || !answers) {
      return NextResponse.json({ error: 'חסרים נתונים' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data: trip } = await supabase
      .from('trips')
      .select('id, status')
      .eq('id', trip_id)
      .single();

    if (!trip) {
      return NextResponse.json({ error: 'טיול לא נמצא' }, { status: 404 });
    }

    const questionnaireId = uuidv4();
    const { error: qError } = await supabase.from('questionnaires').insert({
      id: questionnaireId,
      trip_id,
      answers_json: answers,
      submitted_at: new Date().toISOString(),
      version: 1,
    });

    if (qError) {
      console.error('Questionnaire save error:', qError);
      return NextResponse.json({ error: 'שגיאה בשמירת השאלון' }, { status: 500 });
    }

    const { error: tripError } = await supabase
      .from('trips')
      .update({
        status: 'questionnaire_completed',
        destination: answers.destination || null,
        departure_date: answers.departure_date || null,
        return_date: answers.return_date || null,
        flexible_dates: answers.flexible_dates || false,
        travelers_adults: answers.adults || 1,
        travelers_children: answers.children || 0,
        children_ages: answers.children_ages || [],
        budget: answers.budget_total || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trip_id);

    if (tripError) {
      console.error('Trip update error:', tripError);
    }

    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'system',
      actor_id: 'questionnaire',
      action: 'questionnaire.completed',
      entity: 'trip',
      entity_id: trip_id,
      after: { questionnaire_id: questionnaireId, status: 'questionnaire_completed' },
      timestamp: new Date().toISOString(),
    });

    const { data: tripWithCustomer } = await supabase
      .from('trips')
      .select('destination, trip_type, customer:customers(name, email, phone)')
      .eq('id', trip_id)
      .single();

    const customerName = (tripWithCustomer?.customer as { name?: string } | null)?.name || 'לקוח';
    const customerEmail = (tripWithCustomer?.customer as { email?: string } | null)?.email || '';
    const customerPhone = (tripWithCustomer?.customer as { phone?: string } | null)?.phone || '';
    const destination = tripWithCustomer?.destination || answers.destination || 'לא צוין';

    await emitEvent('questionnaire.completed', {
      trip_id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      destination,
      answers_version: 1,
    });

    await emitEvent('ai.agent.start', {
      trip_id,
      customer_name: customerName,
      customer_email: customerEmail,
      destination,
      answers,
    });

    return NextResponse.json({ success: true, questionnaire_id: questionnaireId });
  } catch (error) {
    console.error('Questionnaire submission failed:', error);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
