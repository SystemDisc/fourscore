import Pageview from '@/components/atoms/pageview';
import NotificationProvider from '@/providers/notification-provider';
import { RouteTrackerProvider } from '@/providers/route-tracking-provider';
import NextAuthSessionProvider from '@/providers/session-provider';
import authOptions from '@/utils/auth-options';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import classNames from 'classnames';
import { getServerSession } from 'next-auth';
import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  adjustFontFallback: false,
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <head>
        <title>FourScore: Match Your Vote with Your Values</title>
        <GoogleTagManager gtmId='GTM-TK3ZT6B3' />
        <script
          id='register-sw'
          dangerouslySetInnerHTML={{
            __html: `
            const registerServiceWorker = async () => {
              if ("serviceWorker" in navigator) {
                try {
                  const registration = await navigator.serviceWorker.register("/sw.js", {
                    scope: "/",
                  });
                  if (registration.installing) {
                    console.log("Service worker installing");
                  } else if (registration.waiting) {
                    console.log("Service worker installed");
                  } else if (registration.active) {
                    console.log("Service worker active");
                  }
                } catch (error) {
                  console.error(\`Registration failed with:\`, error);
                }
              }
            };
            registerServiceWorker().catch(console.error);
          `,
          }}
        />
        <script
          id='layout-ld'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: 'https://fourscore.app',
              name: 'FourScore',
              description:
                'FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://fourscore.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'FourScore',
              },
            }),
          }}
        />
      </head>
      <body className={classNames(lato.className, 'bg-[#ececec]')}>
        <Pageview />
        <NextAuthSessionProvider session={session!}>
          <RouteTrackerProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </RouteTrackerProvider>
        </NextAuthSessionProvider>
        <Analytics />
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-TK3ZT6B3'
            height='0'
            width='0'
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          />
        </noscript>
      </body>
    </html>
  );
}
