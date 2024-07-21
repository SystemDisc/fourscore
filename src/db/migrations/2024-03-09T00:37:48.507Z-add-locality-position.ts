import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
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

export async function down(db: Kysely<any>) {
  await db
    .updateTable('Locality')
    .set({
      position: null,
    })
    .execute();
}
