import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('Office')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('localityId', 'uuid', (col) => col.notNull())
    .addColumn('location', 'varchar', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('CandidateOffice')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('officeId', 'uuid', (col) => col.notNull())
    .execute();

  let me = await db.selectFrom('User').selectAll().where('User.email', '=', 'admin@zornco.com').executeTakeFirst();

  if (!me) {
    const [me] = await db
      .insertInto('User')
      .values({
        name: 'Timothy Zorn',
        email: 'admin@zornco.com',
        emailVerified: new Date(),
        image: null,
      })
      .returningAll()
      .execute();
  }

  const federal = await db.selectFrom('Locality').selectAll().where('name', '=', 'Federal').executeTakeFirst();

  const [office] = await db
    .insertInto('Office')
    .values({
      localityId: federal!.id,
      location: 'The United States of America',
      name: 'President',
    })
    .returningAll()
    .execute();

  await db
    .insertInto('CandidateOffice')
    .values({
      userId: me!.id,
      officeId: office.id,
    })
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('Office').execute();
  await db.schema.dropTable('CandidateOffice').execute();
}
