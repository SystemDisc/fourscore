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

  await db.insertInto('User').values(initialPresidentialCandidates).returningAll().execute();

  await db.insertInto('Office').values(officeOfPresident).returningAll().execute();

  await db
    .insertInto('CandidateOffice')
    .values([
      {
        id: 'c862a0dc-4061-4c88-8a8f-2aea3fb77682',
        userId: '04a990af-a61e-41f2-beb0-d4098b533de5',
        officeId: officeOfPresident.id,
      },
      {
        id: '50734342-9ff4-4d22-b4ba-6fd3116187bb',
        userId: 'c3066d9e-ac51-444d-a4bd-8dd690554610',
        officeId: officeOfPresident.id,
      },
      {
        id: '9dfb192c-61af-42d9-b44e-208bfbd43871',
        userId: '87ab6a98-2c2b-4429-8d22-89eda0506fbb',
        officeId: officeOfPresident.id,
      },
      {
        id: '2cc98f6d-01ad-4ed3-8688-afb69b8175ea',
        userId: 'b047056f-6d63-4afc-8870-e616abaf7505',
        officeId: officeOfPresident.id,
      },
      {
        id: '9c21810e-2ac9-4eb0-a412-c63acf6bc1b6',
        userId: '69504b7c-4961-4b3f-867a-d2c6b5f4cdb3',
        officeId: officeOfPresident.id,
      },
      {
        id: '4ad80ef8-015c-4101-8c6d-b6f198d95aed',
        userId: '267a857e-d76f-4223-884f-076c0c66e85e',
        officeId: officeOfPresident.id,
      },
    ])
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable('Office').execute();
  await db.schema.dropTable('CandidateOffice').execute();
  await db.deleteFrom('User').where(
    'id',
    'in',
    initialPresidentialCandidates.map((c) => c.id),
  );
}

export const initialPresidentialCandidates = [
  {
    id: 'b047056f-6d63-4afc-8870-e616abaf7505',
    name: 'Chase Oliver',
    email: 'chaseoliver@fourscore.app',
    emailVerified: null,
    image: '/images/chase-oliver.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '267a857e-d76f-4223-884f-076c0c66e85e',
    name: 'Cornel West',
    email: 'cornelwest@fourscore.app',
    emailVerified: null,
    image: '/images/cornel-west.jpg',
    dateUpdated: null,
    seenVotingTutorial: true,
  },
  {
    id: '04a990af-a61e-41f2-beb0-d4098b533de5',
    name: 'Donald J. Trump',
    email: 'donaldjtrump@fourscore.app',
    emailVerified: null,
    image: '/images/donald-trump.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '69504b7c-4961-4b3f-867a-d2c6b5f4cdb3',
    name: 'Jill Stein',
    email: 'jillstein@fourscore.app',
    emailVerified: null,
    image: '/images/jill-stein.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: 'c3066d9e-ac51-444d-a4bd-8dd690554610',
    name: 'Joe Biden',
    email: 'joebiden@fourscore.app',
    emailVerified: null,
    image: '/images/joe-biden.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
  {
    id: '87ab6a98-2c2b-4429-8d22-89eda0506fbb',
    name: 'Robert F. Kennedy Jr.',
    email: 'robertfkennedyjr@fourscore.app',
    emailVerified: null,
    image: '/images/robert-f-kennedy-jr.jpg',
    dateUpdated: null,
    seenVotingTutorial: false,
  },
];

export const officeOfPresident = {
  id: '54b4e93c-81df-4686-aa28-3ee431ed7c16',
  localityId: '2391e8f3-bff3-4ca2-ba62-b8912d8d8e94',
  location: 'The United States of America',
  name: 'President',
};
