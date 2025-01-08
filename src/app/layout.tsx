'use client';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import './globals.css';

// More specific type for dataLayer
type DataLayerItem = {
  event: string;
  page_path?: string;
  page_location?: string;
  utm_source?: string | undefined;
  utm_medium?: string | undefined;
  utm_campaign?: string | undefined;
};

// Declare global types for dataLayer
declare global {
  interface Window {
    dataLayer: DataLayerItem[];
    gtag: (command: string, ...args: (string | Date | { [key: string]: string })[]) => void;
  }
}

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined
    });
  }, [pathname, searchParams]);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script 
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-NDFVWRH841"
        />
        <Script 
          strategy="afterInteractive"
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NDFVWRH841');
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=G-NDFVWRH841" 
            height="0" 
            width="0" 
            style={{display:'none', visibility:'hidden'}}
          />
        </noscript>
        <main>{children}</main>
      </body>
    </html>
  );
}