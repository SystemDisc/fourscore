import appRootPath from 'app-root-path';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import slugify from 'slugify';

const name = `${new Date().toISOString()}${process.argv[2] ? `-${slugify(process.argv[2].trim()).toLowerCase()}` : ''}`;

const initialCode = String.raw`import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('NewTable')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql${'`'}gen_random_uuid()${'`'}))
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'varchar', (col) => col.notNull())
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql${'`'}clock_timestamp()${'`'}))
    .addColumn('dateUpdated', 'timestamptz')
    .addColumn('dateDeleted', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('NewTable').execute();
}
`;

const filename = `${name}.ts`;
const fullPath = resolve(appRootPath.path, 'src', 'db', 'migrations', filename);
writeFileSync(fullPath, initialCode);

console.log(`Migration ${filename} created successfully`);
