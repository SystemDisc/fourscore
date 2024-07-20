import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('Answer').addColumn('notes', 'text').execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('Answer').dropColumn('notes').execute();
}
