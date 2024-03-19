import { db } from '@/db/database';
import { Database, KyselyAdapter } from '@auth/kysely-adapter';
import { Kysely } from 'kysely';
import { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Email from 'next-auth/providers/email';
import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';

const authOptions: AuthOptions = {
  adapter: KyselyAdapter(db as unknown as Kysely<Database>) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: 'light',
    brandColor: '#22c064',
    logo: 'https://fourscore.app/images/home/logo.svg',
  },
  pages: {
    newUser: '/user/sign-up',
  },
};

export default authOptions;
