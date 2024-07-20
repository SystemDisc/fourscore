import { db } from '@/db/database';
import authOptions from '@/utils/auth-options';
import { Database, KyselyAdapter } from '@auth/kysely-adapter';
import { Kysely } from 'kysely';
import NextAuth, { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Email from 'next-auth/providers/email';
import Google from 'next-auth/providers/google';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
