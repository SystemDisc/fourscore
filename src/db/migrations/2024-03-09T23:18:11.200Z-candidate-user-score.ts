import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('CandidateUserScore')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('candidateId', 'uuid', (col) => col.notNull())
    .addColumn('score', 'decimal', (col) => col.notNull())
    .addColumn('dateUpdated', 'timestamp', (col) => col.notNull())
    .execute();

  await db.schema
    .alterTable('Answer')
    .addColumn('dateUpdated', 'timestamp', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('CandidateUserScore').execute();
  await db.schema.alterTable('Answer').dropColumn('dateUpdated').execute();
}
