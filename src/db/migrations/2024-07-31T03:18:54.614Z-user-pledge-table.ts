import { calculateMatches } from '@/utils/server-actions';
import { Kysely, sql } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable('UserPledge')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('userId', 'uuid', (col) => col.notNull())
    .addColumn('candidateId', 'uuid', (col) => col.notNull())
    .addColumn('dateCreated', 'timestamptz', (col) => col.notNull().defaultTo(sql`clock_timestamp()`))
    .addColumn('dateUpdated', 'timestamptz')
    .addColumn('dateDeleted', 'timestamptz')
    .addUniqueConstraint('uk_UserPledge_userId_candidateId_dateDeleted', ['userId', 'candidateId', 'dateDeleted'])
    .addForeignKeyConstraint('fk_UserPledge_userId', ['userId'], 'User', ['id'], (cb) =>
      cb.onDelete('cascade').onUpdate('cascade'),
    )
    .addForeignKeyConstraint('fk_UserPledge_candidateId', ['candidateId'], 'User', ['id'], (cb) =>
      cb.onDelete('cascade').onUpdate('cascade'),
    )
    .execute();

  const users = await db.selectFrom('User').select('email').execute();
  for (const user of users) {
    try {
      await calculateMatches({ email: user.email });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const rankedScores = db
    .selectFrom('CandidateUserScore')
    .select([
      'userId',
      'candidateId',
      'score',
      sql`ROW_NUMBER() OVER (
        PARTITION BY "userId"
        ORDER BY "score" DESC, "candidateId" ASC
      )`.as('rn'),
    ])
    .where('score', '<>', NaN)
    .as('RankedScores');

  const candidateUserScores = await db
    .selectFrom(rankedScores)
    .select(['userId', 'candidateId', 'score'])
    .where('rn', '=', 1)
    .execute();

  for (const { userId, candidateId } of candidateUserScores) {
    await db
      .insertInto('UserPledge')
      .values({
        userId,
        candidateId,
      })
      .execute();
  }
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('UserPledge').execute();
}
