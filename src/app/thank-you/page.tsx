'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <Card className="text-center shadow-xl">
        <div className="w-20 h-20 bg-[#21C7B7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#21C7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#102A43] mb-4">תודה רבה!</h1>

        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          קיבלנו את הפרטים שלכם. בדקו את תיבת המייל —
          <br />
          שלחנו לכם שאלון קצר שיעזור לנו לבנות הצעה מדויקת.
        </p>

        <div className="bg-[#F5F7FA] rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-[#102A43] mb-4">מה קורה עכשיו?</h3>
          <div className="space-y-3 text-right">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#21C7B7] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-sm text-gray-600">בדקו את המייל ומלאו שאלון אפיון קצר</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#102A43]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#102A43] text-sm font-bold">2</span>
              </div>
              <span className="text-sm text-gray-600">מערכת AI תחקור ותבנה 3 הצעות מותאמות</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#102A43]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#102A43] text-sm font-bold">3</span>
              </div>
              <span className="text-sm text-gray-600">נציג יבדוק את ההצעה ותקבלו אותה למייל</span>
            </div>
          </div>
        </div>

        {tripId && (
          <div className="mb-6">
            <Link href={`/questionnaire?trip=${tripId}`}>
              <Button size="lg" className="w-full sm:w-auto">
                מלאו את השאלון עכשיו
              </Button>
            </Link>
          </div>
        )}

        <Link href="/" className="text-sm text-gray-500 hover:text-[#102A43] transition-colors">
          חזרה לדף הבית
        </Link>
      </Card>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-20 text-center">טוען...</div>}>
          <ThankYouContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
