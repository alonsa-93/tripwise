'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#102A43] rounded-xl flex items-center justify-center">
              <span className="text-[#21C7B7] font-bold text-lg">TW</span>
            </div>
            <span className="text-xl font-bold text-[#102A43]">TripWise AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="text-gray-600 hover:text-[#102A43] transition-colors text-sm">
              איך זה עובד?
            </Link>
            <Link href="/#benefits" className="text-gray-600 hover:text-[#102A43] transition-colors text-sm">
              יתרונות
            </Link>
            <Link href="/#lead-form" className="bg-[#FFB347] hover:bg-[#f0a030] text-[#102A43] font-bold px-5 py-2 rounded-xl transition-all text-sm shadow-md hover:shadow-lg">
              התחילו לתכנן
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
