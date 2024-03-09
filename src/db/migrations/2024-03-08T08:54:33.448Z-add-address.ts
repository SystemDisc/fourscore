import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('Address')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('streetNumber', 'varchar', (col) => col.notNull())
    .addColumn('route', 'varchar', (col) => col.notNull())
    .addColumn('city', 'varchar', (col) => col.notNull())
    .addColumn('state', 'varchar', (col) => col.notNull())
    .addColumn('zip', 'varchar', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('Address').execute();
}
