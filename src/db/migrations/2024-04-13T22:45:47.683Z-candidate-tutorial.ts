import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .alterTable('User')
    .addColumn('seenVotingTutorial', 'boolean', (col) => col.defaultTo(false).notNull())
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.alterTable('User').dropColumn('seenVotingTutorial').execute();
}
