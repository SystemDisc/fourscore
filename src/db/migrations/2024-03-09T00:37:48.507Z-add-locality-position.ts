import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema.alterTable('Locality').addColumn('position', 'integer').execute();

  await db
    .updateTable('Locality')
    .where('id', '=', 'fefab2ef-61cd-4ffa-b480-2439f34f7b7e')
    .set({
      position: 0,
    })
    .execute();

  await db
    .updateTable('Locality')
    .where('id', '=', '73c0ff5a-6826-42db-9dc3-a0b5bc62fbb2')
    .set({
      position: 1,
    })
    .execute();

  await db
    .updateTable('Locality')
    .where('id', '=', '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94')
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
