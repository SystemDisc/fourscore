import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('Answer')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('questionId', 'uuid', (col) => col.notNull())
    .addColumn('agree', 'boolean', (col) => col.notNull())
    .addColumn('rating', 'integer', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('Answer').execute();
}
