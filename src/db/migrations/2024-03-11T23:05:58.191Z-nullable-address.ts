import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('Address')
    .alterColumn('streetNumber', (col) => col.dropNotNull())
    .alterColumn('route', (col) => col.dropNotNull())
    .alterColumn('city', (col) => col.dropNotNull())
    .alterColumn('state', (col) => col.dropNotNull())
    .alterColumn('zip', (col) => col.dropNotNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.updateTable('Address')
    .set({
      streetNumber: '',
    })
    .where('streetNumber', 'is', null)
    .execute();

  await db.updateTable('Address')
    .set({
      route: '',
    })
    .where('route', 'is', null)
    .execute();

  await db.updateTable('Address')
    .set({
      city: '',
    })
    .where('city', 'is', null)
    .execute();

  await db.updateTable('Address')
    .set({
      state: '',
    })
    .where('state', 'is', null)
    .execute();

  await db.updateTable('Address')
    .set({
      zip: '',
    })
    .where('zip', 'is', null)
    .execute();

  await db.schema.alterTable('Address')
    .alterColumn('streetNumber', (col) => col.setNotNull())
    .alterColumn('route', (col) => col.setNotNull())
    .alterColumn('city', (col) => col.setNotNull())
    .alterColumn('state', (col) => col.setNotNull())
    .alterColumn('zip', (col) => col.setNotNull())
    .execute();
}
