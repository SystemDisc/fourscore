import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('Answer')
    .addColumn('skipped', 'boolean', (col) => col.defaultTo(false).notNull())
    .alterColumn('agree', (col) => col.dropNotNull())
    .alterColumn('rating', (col) => col.dropNotNull())
    .execute();
  await db.schema
    .alterTable('Answer')
    .alterColumn('agree', (col) => col.setDefault(null))
    .alterColumn('rating', (col) => col.setDefault(null))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('Answer')
    .dropColumn('skipped')
    .alterColumn('agree', (col) => col.setNotNull())
    .alterColumn('rating', (col) => col.setNotNull())
    .execute();
  await db.schema
    .alterTable('Answer')
    .alterColumn('agree', (col) => col.dropDefault())
    .alterColumn('rating', (col) => col.dropDefault())
    .execute();
}
