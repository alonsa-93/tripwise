'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import type { LeadFormData, TripType } from '@/types';
import { TRIP_TYPE_LABELS } from '@/lib/constants';

export function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    destination: '',
    travel_month: '',
    travelers: 1,
    trip_type: 'unknown' as TripType,
    budget: '',
    contact_consent: false,
    marketing_consent: false,
  });

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name || form.name.length < 2) newErrors.name = 'נא להזין שם (לפחות 2 תווים)';
    if (!form.phone || !/^(\+?972|0)[\d\-]{8,}$/.test(form.phone.replace(/[\s\-]/g, '')))
      newErrors.phone = 'נא להזין מספר טלפון תקין';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'נא להזין כתובת מייל תקינה';
    if (form.travelers < 1) newErrors.travelers = 'מינימום נוסע אחד';
    if (!form.contact_consent) newErrors.contact_consent = 'חובה לאשר יצירת קשר';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/thank-you?id=${data.trip_id}`);
      } else {
        setErrors({ submit: data.error || 'שגיאה בשליחת הטופס' });
      }
    } catch {
      setErrors({ submit: 'שגיאה בשליחת הטופס. נסו שנית.' });
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof LeadFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
          placeholder="השם שלך"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">טלפון *</label>
          <input
            id="phone"
            type="tel"
            dir="ltr"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
            placeholder="050-000-0000"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">אימייל *</label>
          <input
            id="email"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">יעד רצוי</label>
          <input
            id="destination"
            type="text"
            value={form.destination}
            onChange={(e) => updateField('destination', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
            placeholder="עדיין לא יודע/ת? זה בסדר!"
          />
        </div>
        <div>
          <label htmlFor="travel_month" className="block text-sm font-medium text-gray-700 mb-1">חודש/תאריך משוער</label>
          <input
            id="travel_month"
            type="month"
            value={form.travel_month}
            onChange={(e) => updateField('travel_month', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">מספר נוסעים *</label>
          <input
            id="travelers"
            type="number"
            min={1}
            max={20}
            value={form.travelers}
            onChange={(e) => updateField('travelers', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
          />
          {errors.travelers && <p className="text-red-500 text-xs mt-1">{errors.travelers}</p>}
        </div>
        <div>
          <label htmlFor="trip_type" className="block text-sm font-medium text-gray-700 mb-1">סוג טיול *</label>
          <select
            id="trip_type"
            value={form.trip_type}
            onChange={(e) => updateField('trip_type', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition bg-white"
          >
            {Object.entries(TRIP_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">תקציב משוער</label>
        <input
          id="budget"
          type="text"
          value={form.budget}
          onChange={(e) => updateField('budget', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none transition"
          placeholder="למשל: 5,000-10,000 ₪ לזוג"
        />
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.contact_consent}
            onChange={(e) => updateField('contact_consent', e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]"
          />
          <span className="text-sm text-gray-600">
            אני מסכים/ה ליצירת קשר לצורך הכנת הצעת טיול מותאמת אישית *
          </span>
        </label>
        {errors.contact_consent && <p className="text-red-500 text-xs">{errors.contact_consent}</p>}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.marketing_consent}
            onChange={(e) => updateField('marketing_consent', e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]"
          />
          <span className="text-sm text-gray-600">
            אני מעוניין/ת לקבל עדכונים ומבצעים (אופציונלי)
          </span>
        </label>
      </div>

      {errors.submit && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm">{errors.submit}</div>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        התחילו לתכנן את הטיול שלכם
      </Button>

      <p className="text-xs text-gray-400 text-center">
        המידע ישמש רק לצורך הכנת הצעה. לא נבצע הזמנה או תשלום ללא אישורך.
      </p>
    </form>
  );
}
