import NotificationProvider from '@/providers/notification-provider';
import NextAuthSessionProvider from '@/providers/session-provider';
import authOptions from '@/utils/auth-options';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import classNames from 'classnames';
import { getServerSession } from 'next-auth';
import { Lato } from 'next/font/google';
import Script from 'next/script';
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
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/favicon-16x16.png'
        />
        <link
          rel='manifest'
          href='/manifest.json'
        />
        <link
          rel='mask-icon'
          href='/icons/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <link
          rel='shortcut icon'
          href='/icons/favicon.ico'
        />
        <meta
          name='msapplication-TileColor'
          content='#00a300'
        />
        <meta
          name='msapplication-config'
          content='/browserconfig.xml'
        />
        <meta
          name='theme-color'
          content='#ffffff'
        />
        <meta
          name='description'
          content="FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized 'Four Score,' reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values."
        />
        <meta
          property='og:image'
          content='https://fourscore.app/images/website-preview.png'
        />
        <meta
          property='og:description'
          content="FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized 'Four Score,' reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values."
        />
        <GoogleTagManager gtmId='GTM-TK3ZT6B3' />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {'send_to': 'AW-16497301357/hwrOCPuNzZ0ZEO2uw7o9'});
              return false;
            }
          `,
          }}
        />
        <Script
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
                  console.error(\`Registration failed with \${error}\`);
                }
              }
            };
            registerServiceWorker().catch(console.error);
          `,
          }}
        />
      </head>
      <body className={classNames(lato.className, 'bg-[#ececec]')}>
        <NextAuthSessionProvider session={session!}>
          <NotificationProvider>{children}</NotificationProvider>
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
