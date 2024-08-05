import { ExtendedAnswer } from '@/scripts/openai/candidate-answers';
import appRootPath from 'app-root-path';
import { readFileSync } from 'fs';
import { Kysely, sql } from 'kysely';
import path from 'path';
import { Database } from '../database';

const jsonFilename = path.resolve(appRootPath.path, 'src', 'data', 'candidateResponses.json');
const answers = JSON.parse(readFileSync(jsonFilename).toString()) as ExtendedAnswer[];

export async function up(db: Kysely<Database>) {
  await db.schema
    .alterTable('Answer')
    .addColumn('importance', 'integer')
    .addColumn('answeredByStaff', 'boolean', (col) => col.defaultTo(false))
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .execute();

  await db.insertInto('Answer').values(answers).execute();
}

export async function down(db: Kysely<Database>) {
  await db
    .deleteFrom('Answer')
    .where(
      'id',
      'in',
      answers.map((a) => a.id),
    )
    .execute();
  await db.schema.alterTable('Answer').dropColumn('answeredByStaff').dropColumn('dateCreated').execute();
}
