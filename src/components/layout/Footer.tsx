import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#102A43] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-[#21C7B7] font-bold">TW</span>
              </div>
              <span className="text-lg font-bold">TripWise AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              תכנון טיולים חכם בסיוע בינה מלאכותית, עם בקרה אנושית מלאה.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">קישורים</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">דף הבית</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">איך זה עובד?</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">הצהרת נגישות</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">יצירת קשר</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@tripwise.ai</li>
              <li>הפרטים ישמשו רק לצורך הכנת הצעה.</li>
              <li>לא נבצע הזמנה או תשלום ללא אישורך.</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TripWise AI. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
