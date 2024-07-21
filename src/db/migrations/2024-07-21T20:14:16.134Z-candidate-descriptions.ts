import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('CandidateData')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .addColumn('dateUpdated', 'timestamptz')
    .addColumn('dateDeleted', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('CandidateData').execute();
}
