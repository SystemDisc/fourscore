import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
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
    .addColumn('dateUpdated', 'timestamp', (col) => col.notNull().defaultTo(new Date()))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('CandidateUserScore').execute();
  await db.schema.alterTable('Answer').dropColumn('dateUpdated').execute();
}
