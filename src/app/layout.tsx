import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'] });

export const metadata: Metadata = {
  title: 'FourScore',
  description: 'Find your perfect candidate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
