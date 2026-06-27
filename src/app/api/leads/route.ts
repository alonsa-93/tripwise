import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { emitEvent } from '@/lib/automation-adapter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, email, destination, travel_month, travelers, trip_type, budget, contact_consent, marketing_consent } = body;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'שם חסר או קצר מדי' }, { status: 400 });
    }
    if (!phone || !/^(\+?972|0)[\d\-]{8,}$/.test(phone.replace(/[\s\-]/g, ''))) {
      return NextResponse.json({ error: 'מספר טלפון לא תקין' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'כתובת מייל לא תקינה' }, { status: 400 });
    }
    if (!contact_consent) {
      return NextResponse.json({ error: 'חובה לאשר יצירת קשר' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const tripId = uuidv4();

    // Find or create customer by email
    let customerId: string;
    const { data: existing } = await supabase.from('customers').select('id').eq('email', email).single();
    if (existing) {
      customerId = existing.id;
    } else {
      customerId = uuidv4();
      const { error: customerError } = await supabase.from('customers').insert({
        id: customerId,
        name,
        email,
        phone,
        marketing_consent: marketing_consent || false,
        privacy_accepted_at: new Date().toISOString(),
      });
      if (customerError) {
        console.error('Customer creation error:', customerError);
        return NextResponse.json({ error: 'שגיאה ביצירת רשומת לקוח' }, { status: 500 });
      }
    }

    const { error: tripError } = await supabase.from('trips').insert({
      id: tripId,
      customer_id: customerId,
      destination: destination || null,
      departure_date: null,
      return_date: null,
      flexible_dates: false,
      travelers_adults: travelers || 1,
      travelers_children: 0,
      children_ages: [],
      budget: budget || null,
      budget_level: null,
      trip_type: trip_type || 'unknown',
      status: 'new_lead',
      travel_month: travel_month || null,
    });

    if (tripError) {
      console.error('Trip creation error:', tripError);
      return NextResponse.json({ error: 'שגיאה ביצירת טיול' }, { status: 500 });
    }

    await supabase.from('audit_logs').insert({
      id: uuidv4(),
      actor_type: 'system',
      actor_id: 'lead_form',
      action: 'lead.created',
      entity: 'trip',
      entity_id: tripId,
      after: { customer_id: customerId, source: 'website', status: 'new_lead' },
      timestamp: new Date().toISOString(),
    });

    await emitEvent('lead.created', {
      lead_id: tripId,
      trip_id: tripId,
      customer_id: customerId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      destination: destination || 'לא צוין',
      trip_type: trip_type || 'unknown',
      source: 'website',
      consents: { contact: true, marketing: marketing_consent },
    });

    return NextResponse.json({
      trip_id: tripId,
      message: 'הליד נקלט בהצלחה',
    });
  } catch (error) {
    console.error('Lead creation failed:', error);
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 });
  }
}
