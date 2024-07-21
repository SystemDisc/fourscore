import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema.alterTable('Answer').addColumn('notes', 'text').execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.alterTable('Answer').dropColumn('notes').execute();
}
