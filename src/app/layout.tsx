// layout.tsx
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Replace with your own environment variables if needed
const GTM_ID = 'GTM-56R5VF28'; // Or process.env.NEXT_PUBLIC_GTM_ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Tag Manager (GTM) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Google Ads */}
        {GOOGLE_ADS_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            />
            <Script
              id="google-ads"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Additional Google Ads Conversion Tracking */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16818747005"
        />
        <Script
          id="additional-google-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16818747005');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Main content */}
        <main>{children}</main>

        {/* NoScript fallback for GTM */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Conversion Tracking Script */}
        <Script
          id="conversion-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                if (document.location.pathname.includes('/')) {
                  document.addEventListener('click', function(e) {
                    const target = e.target.closest('button[type="submit"]');
                    if (target) {
                      const timer = setInterval(function() {
                        const successElement = document.querySelector('[aria-atomic="true"]');
                        if (successElement && successElement.innerText.includes('Success')) {
                          gtag('event', 'conversion', {
                            'send_to': 'AW-16818747005/mqKZCNyxiIEaEP3s5tM-'
                          });
                          clearInterval(timer);
                        }
                      }, 1000);
                    }
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
