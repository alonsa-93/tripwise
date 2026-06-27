'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'דשבורד', icon: '📊' },
  { href: '/admin/leads', label: 'לידים', icon: '👥' },
  { href: '/admin/agents', label: 'סוכנים', icon: '🤖' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-[#102A43] text-white flex-shrink-0">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-[#21C7B7] font-bold text-sm">TW</span>
            </div>
            <span className="font-bold">TripWise AI</span>
          </Link>
        </div>
        <nav className="px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm transition-all
                  ${active ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-6">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            חזרה לאתר
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-[#F5F7FA] overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
