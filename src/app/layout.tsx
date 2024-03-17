import { Lato } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import NextAuthSessionProvider from '@/providers/session-provider';
import classNames from 'classnames';
import NotificationProvider from '@/providers/notification-provider';
import authOptions from '@/utils/auth-options';
import { Analytics } from '@vercel/analytics/react';

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <title>FourScore: Match Your Vote with Your Values</title>
        <meta name="description" content="FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized 'Four Score,' reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values." />
        <meta property="og:image" content="https://fourscore.app/images/website-preview.png" />
        <meta property="og:description" content="FourScore revolutionizes the voting experience by using a policy-based matching system to connect voters with political candidates. By filling out a comprehensive survey on key issues, both voters and candidates receive a personalized 'Four Score,' reflecting their alignment on local, state, and federal policies. This innovative approach ensures voters can make more informed decisions at the ballot box, while candidates can engage more effectively with their potential supporters, making democracy more accessible and aligned with individual values." />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16497301357">
        </script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-16497301357');
          `,
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-16497301357/F2BPCMWh9pwZEO2uw7o9',
                  'value': 1.0,
                  'currency': 'USD',
                  'event_callback': callback
              });
              return false;
            }
          `,
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TK3ZT6B3');
          `,
        }} />
      </head>
      <body className={classNames(lato.className, 'bg-[#ececec]')}>
        <NextAuthSessionProvider session={session!}>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </NextAuthSessionProvider>
        <Analytics debug={true} />
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TK3ZT6B3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
      </body>
    </html>
  );
}
