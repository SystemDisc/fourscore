import { db } from '@/db/database';
import { Database, KyselyAdapter } from '@auth/kysely-adapter';
import { Kysely } from 'kysely';
import { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';

const authOptions: AuthOptions = {
  adapter: KyselyAdapter(db as unknown as Kysely<Database>) as Adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
      if (isNewUser) {
        const url = new URL('https://server-side-tagging-eta3rcf4fa-uc.a.run.app/mp/collect');
        url.searchParams.set('measurement_id', 'G-WHQGZ00D5B');
        url.searchParams.set('api_secret', process.env.MP_API_SECRET || '');
        fetch(url.href, {
          method: 'POST',
          headers: {
            'x-gtm-server-preview': 'ZW52LTZ8TFZaSVFQel9ld25OODZIalQ1Ym5kZ3wxOGU0YWYyMGU0ODc4NzA2MThhNzM=',
          },
          body: JSON.stringify({
            client_id: 'app.fourscore.www',
            events: [{
              name: 'sign_up',
              params: {
                session_id: user.email,
                engagement_time_msec: '100',
              },
            }],
          }),
        });
      }
    }
  },
};

export default authOptions;
