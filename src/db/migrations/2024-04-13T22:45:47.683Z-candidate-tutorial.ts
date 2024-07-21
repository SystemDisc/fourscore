import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('User')
    .addColumn('seenVotingTutorial', 'boolean', (col) => col.defaultTo(false).notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('User').dropColumn('seenVotingTutorial').execute();
}
