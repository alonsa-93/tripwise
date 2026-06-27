import type { Metadata } from "next";
import { Heebo, Inter } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TripWise AI | תכנון טיולים חכם",
  description: "מערכת AI לתכנון נסיעות לחו״ל, עם בקרה אנושית מלאה. קבלו הצעת טיול מותאמת אישית תוך דקות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${inter.variable}`}>
      <body className="font-[family-name:var(--font-heebo)] antialiased bg-[#F5F7FA] text-[#1F2937] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
