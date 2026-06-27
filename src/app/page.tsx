import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LeadForm } from '@/components/forms/LeadForm';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-bl from-[#102A43] via-[#1a3a5c] to-[#102A43] text-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-[#21C7B7] rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">AI עם בקרה אנושית מלאה</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  תכנון טיול חכם
                  <br />
                  <span className="text-[#21C7B7]">בלי הסיבוך</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
                  מערכת AI מתקדמת שמתאימה לכם הצעת טיול מותאמת אישית — טיסות, מלונות, מסלול ואטרקציות.
                  כל הצעה נבדקת על ידי נציג אנושי לפני שליחה.
                </p>
                <a
                  href="#lead-form"
                  className="inline-flex items-center gap-2 bg-[#FFB347] hover:bg-[#f0a030] text-[#102A43] font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  התחילו לתכנן בחינם
                  <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#21C7B7]/20 rounded-xl flex items-center justify-center">
                          <span className="text-[#21C7B7]">1</span>
                        </div>
                        <span className="text-gray-300">ספרו לנו על הטיול שלכם</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#21C7B7]/20 rounded-xl flex items-center justify-center">
                          <span className="text-[#21C7B7]">2</span>
                        </div>
                        <span className="text-gray-300">AI חוקר ומייצר 3 חלופות</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#21C7B7]/20 rounded-xl flex items-center justify-center">
                          <span className="text-[#21C7B7]">3</span>
                        </div>
                        <span className="text-gray-300">נציג בודק ומאשר את ההצעה</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FFB347]/20 rounded-xl flex items-center justify-center">
                          <span className="text-[#FFB347]">✓</span>
                        </div>
                        <span className="text-white font-medium">מקבלים הצעה מותאמת אישית!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-4">
                איך זה עובד?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                תהליך פשוט של 4 שלבים שמשלב את הכוח של AI עם הניסיון של מומחי נסיעות
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'ספרו לנו',
                  desc: 'מלאו טופס קצר על הטיול שחולמים עליו — יעד, תאריכים, תקציב והעדפות.',
                  color: 'bg-blue-50 text-blue-600',
                },
                {
                  step: '02',
                  title: 'AI חוקר',
                  desc: 'מערכת AI מתקדמת מחפשת טיסות, מלונות, אטרקציות ובונה 3 חלופות מותאמות.',
                  color: 'bg-purple-50 text-purple-600',
                },
                {
                  step: '03',
                  title: 'נציג בודק',
                  desc: 'נציג אנושי בודק את ההצעה, מוודא דיוק מחירים, מקורות והתאמה אישית.',
                  color: 'bg-teal-50 text-teal-600',
                },
                {
                  step: '04',
                  title: 'בוחרים ויוצאים!',
                  desc: 'מקבלים הצעה מעוצבת עם 3 חלופות. בוחרים את המועדפת או קובעים שיחה.',
                  color: 'bg-orange-50 text-orange-600',
                },
              ].map((item) => (
                <Card key={item.step} hover>
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-xl font-bold mb-4`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#102A43] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-4">
                למה TripWise AI?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'חיסכון בזמן',
                  desc: 'במקום שעות של חיפוש — מקבלים הצעה מותאמת תוך דקות. כל המידע כבר מסודר עבורכם.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'מידע מגובה במקורות',
                  desc: 'כל המלצה כוללת מקור, תאריך בדיקה ורמת אמינות. אין מידע ממוצא — רק עובדות.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'בקרה אנושית',
                  desc: 'AI לא שולח הצעה לבד. כל הצעה נבדקת ומאושרת על ידי נציג מנוסה לפני שליחה.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <Card key={item.title} hover className="text-center">
                  <div className="w-14 h-14 bg-[#21C7B7]/10 text-[#21C7B7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#102A43] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section id="lead-form" className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-4">
                בואו נתחיל!
              </h2>
              <p className="text-lg text-gray-600">
                מלאו את הפרטים ונחזור אליכם עם שאלון קצר שיעזור לנו לבנות הצעה מדויקת
              </p>
            </div>
            <Card className="shadow-xl">
              <LeadForm />
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
