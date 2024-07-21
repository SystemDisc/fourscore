import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .alterTable('Answer')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();

  await db.schema
    .alterTable('CandidateUserScore')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema
    .alterTable('Answer')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();

  await db.schema
    .alterTable('CandidateUserScore')
    .alterColumn('dateUpdated', (col) => col.setDataType('timestamptz'))
    .execute();
}
