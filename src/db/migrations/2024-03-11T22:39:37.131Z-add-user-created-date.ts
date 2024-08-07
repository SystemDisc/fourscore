import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .alterTable('User')
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .addColumn('dateUpdated', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.alterTable('User').dropColumn('dateCreated').dropColumn('dateUpdated').execute();
}
