// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Professional Trucking & Logistics Services | Nationwide Coverage',
  description: 'Reliable trucking and logistics solutions offering LTL, FTL, and specialized shipping services. Get instant quotes and real-time tracking.',
  keywords: 'trucking services, logistics company, freight shipping, LTL shipping, FTL transport, nationwide logistics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}