import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('User')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar')
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('emailVerified', 'timestamp')
    .addColumn('image', 'varchar')
    .execute();

  await db.schema
    .createTable('Account')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('type', 'varchar', (col) => col.notNull())
    .addColumn('provider', 'varchar', (col) => col.notNull())
    .addColumn('providerAccountId', 'varchar', (col) => col.notNull())
    .addColumn('refresh_token', 'varchar')
    .addColumn('access_token', 'varchar')
    .addColumn('expires_at', 'integer')
    .addColumn('token_type', 'varchar')
    .addColumn('scope', 'varchar')
    .addColumn('id_token', 'varchar')
    .addColumn('session_state', 'varchar')
    .execute();

  await db.schema
    .createTable('Session')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('sessionToken', 'varchar', (col) => col.notNull())
    .addColumn('expires', 'timestamp', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('VerificationToken')
    .addColumn('identifier', 'varchar', (col) => col.notNull())
    .addColumn('token', 'varchar', (col) => col.notNull())
    .addColumn('expires', 'timestamp', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('User').execute();
  await db.schema.dropTable('Account').execute();
  await db.schema.dropTable('Session').execute();
  await db.schema.dropTable('VerificationToken').execute();
}
