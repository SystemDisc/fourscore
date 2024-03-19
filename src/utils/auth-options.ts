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
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      const cookieStore = cookies();
      const client_id = cookieStore.get('client-id')?.value || user.email;
      const session_id = cookieStore.get('session-id')?.value || user.email;
      if (isNewUser) {
        const url = new URL('https://server-side-tagging-eta3rcf4fa-uc.a.run.app/mp/collect');
        url.searchParams.set('measurement_id', 'G-WHQGZ00D5B');
        url.searchParams.set('api_secret', process.env.MP_API_SECRET || '');
        fetch(url.href, {
          method: 'POST',
          body: JSON.stringify({
            client_id,
            user_id: user.email,
            events: [{
              name: 'sign_up',
              params: {
                session_id,
                engagement_time_msec: '100',
                method: user.name ? 'Google' : 'Email',
                value: 1,
                currency: 'USD',
                user_id: user.email,
              },
            }],
          }),
        });
      }
    }
  },
};

export default authOptions;
