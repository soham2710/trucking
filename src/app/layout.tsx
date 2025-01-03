// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head'; // Import the Head component
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
      <Head>
        {/* Google Analytics Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WHZZFH2P2E"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WHZZFH2P2E');
            `,
          }}
        />
      </Head>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
