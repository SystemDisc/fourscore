import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema.alterTable('Locality').addColumn('position', 'integer').execute();

  await db
    .updateTable('Locality')
    .where('name', '=', 'Local')
    .set({
      position: 0,
    })
    .execute();

  await db
    .updateTable('Locality')
    .where('name', '=', 'State')
    .set({
      position: 1,
    })
    .execute();

  await db
    .updateTable('Locality')
    .where('name', '=', 'Federal')
    .set({
      position: 2,
    })
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db
    .updateTable('Locality')
    .set({
      position: null,
    })
    .execute();
}
