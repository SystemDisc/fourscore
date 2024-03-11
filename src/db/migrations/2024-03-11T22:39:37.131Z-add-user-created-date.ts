import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('User')
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .addColumn('dateUpdated', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('User')
    .dropColumn('dateCreated')
    .dropColumn('dateUpdated')
    .execute();
}
