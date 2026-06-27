'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function StatusPage() {
  const params = useParams();
  const tripId = params.id as string;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center shadow-xl">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#102A43] mb-4">ההצעה בהכנה!</h1>

            <p className="text-gray-600 mb-8 leading-relaxed">
              תודה שמילאתם את השאלון. מערכת AI מתקדמת חוקרת עכשיו טיסות, מלונות ואטרקציות
              מותאמות אישית עבורכם.
              <br />
              <strong>נציג אנושי יבדוק את ההצעה לפני שליחה.</strong>
            </p>

            <div className="bg-[#F5F7FA] rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#21C7B7] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">פרטים נקלטו</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#21C7B7] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">שאלון הושלם</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">AI חוקר ובונה הצעה...</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">4</span>
                  </div>
                  <span className="text-sm text-gray-500">בדיקה אנושית</span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">5</span>
                  </div>
                  <span className="text-sm text-gray-500">שליחת ההצעה אליכם</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              מזהה טיול: <span dir="ltr" className="font-mono text-xs">{tripId?.slice(0, 8)}...</span>
            </p>

            <Link href="/" className="text-sm text-[#21C7B7] hover:text-[#102A43] transition-colors">
              חזרה לדף הבית
            </Link>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
