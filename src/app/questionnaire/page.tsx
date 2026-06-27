'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { QuestionnaireAnswers } from '@/types';

const TRAVEL_STYLES = [
  { id: 'food', label: 'אוכל ומסעדות' },
  { id: 'shopping', label: 'שופינג' },
  { id: 'nature', label: 'טבע ונופים' },
  { id: 'kids', label: 'פעילויות ילדים' },
  { id: 'museums', label: 'מוזיאונים ותרבות' },
  { id: 'parks', label: 'פארקים ושעשועים' },
  { id: 'nightlife', label: 'חיי לילה' },
  { id: 'relax', label: 'נופש ומנוחה' },
  { id: 'adventure', label: 'אקסטרים והרפתקאות' },
  { id: 'history', label: 'היסטוריה ואתרים' },
];

function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get('trip');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    flexible_dates: false,
    adults: 2,
    children: 0,
    children_ages: [],
    has_infant: false,
    needs_stroller: false,
    needs_accessibility: false,
    travel_style: [],
    dietary_kosher: false,
    limited_walking: false,
    public_transport: false,
    rental_car: false,
    needs_pool: false,
    city_center: false,
    meeting_slots: [],
    meeting_preference: 'zoom',
  });

  function update<K extends keyof QuestionnaireAnswers>(field: K, value: QuestionnaireAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function toggleStyle(style: string) {
    const current = answers.travel_style || [];
    if (current.includes(style)) {
      update('travel_style', current.filter((s) => s !== style));
    } else if (current.length < 5) {
      update('travel_style', [...current, style]);
    }
  }

  async function handleSubmit() {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_id: tripId, answers }),
      });
      if (res.ok) {
        router.push(`/status/${tripId}`);
      }
    } catch {
      alert('שגיאה בשליחת השאלון. נסו שנית.');
    } finally {
      setLoading(false);
    }
  }

  if (!tripId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Card>
          <h2 className="text-xl font-bold mb-4">קישור לא תקין</h2>
          <p className="text-gray-600 mb-4">לא נמצא מזהה טיול. בדקו את הלינק שקיבלתם במייל.</p>
          <Button onClick={() => router.push('/')}>חזרה לדף הבית</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#102A43] mb-2">שאלון אפיון הטיול</h1>
        <p className="text-gray-600">עזרו לנו להכיר אתכם כדי שנבנה הצעה מדויקת</p>
      </div>

      <ProgressBar currentStep={step} />

      <Card className="shadow-xl">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">פרטי הטיול</h2>
            <div>
              <label htmlFor="q-dest" className="block text-sm font-medium text-gray-700 mb-1">יעד</label>
              <input
                id="q-dest"
                type="text"
                value={answers.destination || ''}
                onChange={(e) => update('destination', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none"
                placeholder="למשל: רומא, ברצלונה, לא יודע/ת"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-dep" className="block text-sm font-medium text-gray-700 mb-1">תאריך יציאה</label>
                <input id="q-dep" type="date" value={answers.departure_date || ''} onChange={(e) => update('departure_date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none" />
              </div>
              <div>
                <label htmlFor="q-ret" className="block text-sm font-medium text-gray-700 mb-1">תאריך חזרה</label>
                <input id="q-ret" type="date" value={answers.return_date || ''} onChange={(e) => update('return_date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={answers.flexible_dates} onChange={(e) => update('flexible_dates', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
              <span className="text-sm text-gray-600">גמישות בתאריכים (עוזר למצוא מחיר טוב יותר)</span>
            </label>
            <div>
              <label htmlFor="q-airport" className="block text-sm font-medium text-gray-700 mb-1">שדה תעופה מועדף</label>
              <input id="q-airport" type="text" value={answers.preferred_airport || ''} onChange={(e) => update('preferred_airport', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none"
                placeholder="למשל: בן גוריון" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">מי נוסע?</h2>
            <p className="text-xs text-gray-500">אין צורך בשם הילד, רק גיל</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-adults" className="block text-sm font-medium text-gray-700 mb-1">מבוגרים</label>
                <input id="q-adults" type="number" min={1} max={20} value={answers.adults} onChange={(e) => update('adults', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none" />
              </div>
              <div>
                <label htmlFor="q-children" className="block text-sm font-medium text-gray-700 mb-1">ילדים</label>
                <input id="q-children" type="number" min={0} max={10} value={answers.children}
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 0;
                    update('children', count);
                    update('children_ages', Array(count).fill(5));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none" />
              </div>
            </div>
            {(answers.children || 0) > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">גילאי ילדים</label>
                <div className="flex gap-2 flex-wrap">
                  {answers.children_ages?.map((age, i) => (
                    <input key={i} type="number" min={0} max={17} value={age}
                      onChange={(e) => {
                        const newAges = [...(answers.children_ages || [])];
                        newAges[i] = parseInt(e.target.value) || 0;
                        update('children_ages', newAges);
                      }}
                      className="w-16 px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none text-center"
                      aria-label={`גיל ילד ${i + 1}`} />
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={answers.has_infant} onChange={(e) => update('has_infant', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
                <span className="text-sm text-gray-600">יש תינוק</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={answers.needs_stroller} onChange={(e) => update('needs_stroller', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
                <span className="text-sm text-gray-600">צריך עגלה</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={answers.needs_accessibility} onChange={(e) => update('needs_accessibility', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
                <span className="text-sm text-gray-600">צורך בנגישות</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">תקציב ונוחות</h2>
            <p className="text-xs text-gray-500">תקציב משוער מספיק בשלב זה</p>
            <div>
              <label htmlFor="q-budget" className="block text-sm font-medium text-gray-700 mb-1">תקציב כולל</label>
              <input id="q-budget" type="text" value={answers.budget_total || ''} onChange={(e) => update('budget_total', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none"
                placeholder="למשל: 5,000-10,000 ₪" />
            </div>
            <div>
              <label htmlFor="q-hotel" className="block text-sm font-medium text-gray-700 mb-1">רמת מלון</label>
              <select id="q-hotel" value={answers.hotel_level || ''} onChange={(e) => update('hotel_level', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none bg-white">
                <option value="">בחרו רמה</option>
                <option value="budget">חסכוני (2-3 כוכבים)</option>
                <option value="mid">בינוני (3-4 כוכבים)</option>
                <option value="premium">פרימיום (4-5 כוכבים)</option>
                <option value="luxury">יוקרה (5 כוכבים+)</option>
              </select>
            </div>
            <div>
              <label htmlFor="q-pref" className="block text-sm font-medium text-gray-700 mb-1">מה הכי חשוב במלון?</label>
              <select id="q-pref" value={answers.hotel_preference || ''} onChange={(e) => update('hotel_preference', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none bg-white">
                <option value="">בחרו העדפה</option>
                <option value="price">מחיר</option>
                <option value="location">מיקום</option>
                <option value="comfort">נוחות</option>
                <option value="luxury">יוקרה</option>
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">סגנון טיול</h2>
            <p className="text-xs text-gray-500">בחרו עד 5 כדי שנדייק</p>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((style) => {
                const selected = answers.travel_style?.includes(style.id);
                return (
                  <button key={style.id} type="button" onClick={() => toggleStyle(style.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                      ${selected ? 'bg-[#21C7B7] text-white border-[#21C7B7]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#21C7B7]'}`}>
                    {style.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400">
              נבחרו: {answers.travel_style?.length || 0} / 5
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">העדפות מיוחדות</h2>
            <p className="text-xs text-gray-500">מידע זה עוזר להתאים מלון ומסלול</p>
            <div className="space-y-2">
              {[
                { key: 'dietary_kosher' as const, label: 'כשרות' },
                { key: 'limited_walking' as const, label: 'הליכה מועטה' },
                { key: 'public_transport' as const, label: 'תחבורה ציבורית' },
                { key: 'rental_car' as const, label: 'השכרת רכב' },
                { key: 'needs_pool' as const, label: 'בריכה' },
                { key: 'city_center' as const, label: 'מרכז העיר' },
              ].map((pref) => (
                <label key={pref.key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!answers[pref.key]} onChange={(e) => update(pref.key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#21C7B7] focus:ring-[#21C7B7]" />
                  <span className="text-sm text-gray-600">{pref.label}</span>
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="q-special" className="block text-sm font-medium text-gray-700 mb-1">העדפות נוספות</label>
              <textarea id="q-special" value={answers.special_preferences || ''} onChange={(e) => update('special_preferences', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none resize-none"
                placeholder="כל מידע נוסף שיעזור לנו..." />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">זמינות לפגישה</h2>
            <p className="text-xs text-gray-500">לא נקבע פגישה בלי אישור נוסף</p>
            <div>
              <label htmlFor="q-slots" className="block text-sm font-medium text-gray-700 mb-1">חלונות זמן נוחים (3-5)</label>
              <textarea id="q-slots" value={answers.meeting_slots?.join('\n') || ''} onChange={(e) => update('meeting_slots', e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none resize-none"
                placeholder="למשל:&#10;יום ראשון 10:00-12:00&#10;יום שלישי 16:00-18:00&#10;יום חמישי 20:00-22:00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">העדפת שיחה</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="meeting_pref" checked={answers.meeting_preference === 'zoom'} onChange={() => update('meeting_preference', 'zoom')}
                    className="w-4 h-4 text-[#21C7B7] focus:ring-[#21C7B7]" />
                  <span className="text-sm text-gray-600">Zoom / וידאו</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="meeting_pref" checked={answers.meeting_preference === 'phone'} onChange={() => update('meeting_preference', 'phone')}
                    className="w-4 h-4 text-[#21C7B7] focus:ring-[#21C7B7]" />
                  <span className="text-sm text-gray-600">טלפון</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="q-note" className="block text-sm font-medium text-gray-700 mb-1">הערה לנציג</label>
              <input id="q-note" type="text" value={answers.meeting_note || ''} onChange={(e) => update('meeting_note', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none"
                placeholder="כל דבר שתרצו שנדע..." />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#102A43]">מה הכי חשוב לכם בטיול הזה?</h2>
            <p className="text-xs text-gray-500">דוגמאות: ילדים, מנוחה, מחיר, חוויה מיוחדת</p>
            <textarea id="q-important" value={answers.most_important || ''} onChange={(e) => update('most_important', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#21C7B7] focus:border-transparent outline-none resize-none"
              placeholder="ספרו לנו מה הכי חשוב לכם בטיול הזה..." />
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>הקודם</Button>
          ) : (
            <div />
          )}
          {step < 7 ? (
            <Button onClick={() => setStep(step + 1)}>שמור והמשך</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>שליחת השאלון</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function QuestionnairePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-20 text-center">טוען...</div>}>
          <QuestionnaireContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
