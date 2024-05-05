import 'dotenv-flow/config';
import * as path from 'path';
import { promises as fs } from 'fs';
import {
  Migrator,
  FileMigrationProvider,
} from 'kysely';
import { db } from './src/db/database';

async function migrateDown() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.resolve(__dirname, 'src/db/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`rollback "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute rollback "${it.migrationName}"`)
    }
  });

  if (error) {
    console.error('failed to rollback');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateDown();

