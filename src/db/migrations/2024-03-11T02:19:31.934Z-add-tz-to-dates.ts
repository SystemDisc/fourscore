import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('Answer')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();

  await db.schema
    .alterTable('CandidateUserScore')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('Answer')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();

  await db.schema.alterTable('CandidateUserScore')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();
}
