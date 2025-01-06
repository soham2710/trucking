'use client';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname, useSearchParams } from 'next/navigation';
import './globals.css';
import { mixpanelTracker } from '@/lib/mixpanel';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    mixpanelTracker.init();
    
    const utmParams = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined
    };

    mixpanelTracker.trackPageView({
      path: pathname,
      referrer: document.referrer,
      ...utmParams
    });
  }, [pathname, searchParams]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}