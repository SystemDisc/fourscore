import appRootPath from 'app-root-path';
import 'dotenv-flow/config';
import { promises as fs } from 'fs';
import { FileMigrationProvider, MigrationResult, Migrator } from 'kysely';
import * as path from 'path';
import { db } from './src/db/database';

function getMigrator() {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.resolve(appRootPath.path, 'src', 'db', 'migrations'),
    }),
  });
}

async function migrateDown() {
  const migrator = getMigrator();

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`down migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute down migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

async function migrateToLatest(steps?: number) {
  const migrator = getMigrator();

  let error: unknown,
    results: MigrationResult[] | undefined = [];
  if (steps !== undefined) {
    for (let i = 0; i < steps; i++) {
      const { error: innerError, results: innerResults } = await migrator.migrateUp();
      if (innerResults) {
        results.push(...innerResults);
      }
      if (innerError) {
        error = innerError;
        break;
      }
    }
  } else {
    ({ error, results } = await migrator.migrateToLatest());
  }

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }
}

if (!process.argv[2]) {
  migrateToLatest().then(() => db.destroy());
} else if (process.argv[2] === 'down') {
  migrateDown().then(() => db.destroy());
} else if (process.argv[2] && !isNaN(+process.argv[2])) {
  migrateToLatest(+process.argv[2]).then(() => db.destroy());
}
