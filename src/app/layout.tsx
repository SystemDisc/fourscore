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
      </head>
      <body className={classNames(lato.className, 'bg-[#ececec]')}>
        <NextAuthSessionProvider session={session!}>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </NextAuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
