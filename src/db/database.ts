import { GeneratedAlways, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

interface Database {
  User: {
    id: GeneratedAlways<string>;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
  Account: {
    id: GeneratedAlways<string>;
    userId: string;
    type: 'oidc' | 'oauth' | 'email' | 'webauthn';
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: "bearer" | "dpop" | Lowercase<string>;
    scope?: string;
    id_token?: string;
    session_state: string | null;
  };
  Session: {
    id: GeneratedAlways<string>;
    userId: string;
    sessionToken: string;
    expires: Date;
  };
  VerificationToken: {
    identifier: string;
    token: string;
    expires: Date;
  };
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})
