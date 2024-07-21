import { Kysely, sql } from 'kysely';
import { v4 } from 'uuid';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('Question')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('localityId', 'uuid', (col) => col.notNull())
    .addColumn('categoryId', 'uuid', (col) => col.notNull())
    .addColumn('question', 'varchar', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('Locality')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('Category')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar', (col) => col.notNull())
    .execute();

  const localId = v4();
  const stateId = v4();
  const federalId = v4();
  await db
    .insertInto('Locality')
    .values([
      {
        id: localId,
        name: 'Local',
      },
      {
        id: stateId,
        name: 'State',
      },
      {
        id: federalId,
        name: 'Federal',
      },
    ])
    .execute();

  const environmentId = v4();
  const publicId = v4();
  const economicId = v4();
  const publicSafetyId = v4();
  const housingId = v4();
  const educationId = v4();
  const socialId = v4();
  const technologyId = v4();
  const cultureId = v4();
  const healthId = v4();
  const justiceId = v4();
  const infrastructureId = v4();
  const employmentId = v4();
  const taxesId = v4();
  const defenseId = v4();
  const immigrationId = v4();
  const rightsId = v4();
  await db
    .insertInto('Category')
    .values([
      {
        id: environmentId,
        name: 'Environmental Policy',
      },
      {
        id: publicId,
        name: 'Public Spaces',
      },
      {
        id: economicId,
        name: 'Economic Policy',
      },
      {
        id: publicSafetyId,
        name: 'Public Safety',
      },
      {
        id: housingId,
        name: 'Housing and Urban Planning',
      },
      {
        id: educationId,
        name: 'Education',
      },
      {
        id: socialId,
        name: 'Social Policy',
      },
      {
        id: technologyId,
        name: 'Technology and Innovation',
      },
      {
        id: cultureId,
        name: 'Community and Culture',
      },
      {
        id: healthId,
        name: 'Healthcare',
      },
      {
        id: justiceId,
        name: 'Criminal Justice and Public Safety',
      },
      {
        id: infrastructureId,
        name: 'Infrastructure',
      },
      {
        id: employmentId,
        name: 'Labor and Employment',
      },
      {
        id: taxesId,
        name: 'Taxes and Government Spending',
      },
      {
        id: defenseId,
        name: 'National Security and Defense',
      },
      {
        id: immigrationId,
        name: 'Immigration',
      },
      {
        id: rightsId,
        name: 'Civil Rights and Liberties',
      },
    ])
    .execute();

  await db
    .insertInto('Question')
    .values([
      {
        localityId: localId,
        categoryId: publicId,
        question: 'Should the city invest more in renewable energy sources for public buildings?',
      },
      {
        localityId: localId,
        categoryId: publicId,
        question: 'Do you support the expansion of public parks and green spaces within the city?',
      },
      {
        localityId: localId,
        categoryId: economicId,
        question: 'Should local government provide tax incentives to attract small businesses?',
      },
      {
        localityId: localId,
        categoryId: economicId,
        question:
          'Do you believe in increasing funding for public transportation to improve accessibility and reduce traffic congestion?',
      },
      {
        localityId: localId,
        categoryId: publicSafetyId,
        question: 'Should the city increase funding for community policing initiatives?',
      },
      {
        localityId: localId,
        categoryId: publicSafetyId,
        question: 'Do you support the implementation of stricter gun control measures within city limits?',
      },
      {
        localityId: localId,
        categoryId: housingId,
        question: 'Do you favor zoning changes to allow more affordable housing developments?',
      },
      {
        localityId: localId,
        categoryId: housingId,
        question: 'Should the city invest in infrastructure improvements in underserved neighborhoods?',
      },
      {
        localityId: localId,
        categoryId: educationId,
        question: 'Do you support the increase of local funding for public schools?',
      },
      {
        localityId: localId,
        categoryId: educationId,
        question: 'Should the city offer free community college tuition to residents?',
      },
      {
        localityId: localId,
        categoryId: socialId,
        question: 'Do you believe the city should expand mental health services accessible to the public?',
      },
      {
        localityId: localId,
        categoryId: socialId,
        question: 'Should local government increase support for homeless shelters and services?',
      },
      {
        localityId: localId,
        categoryId: technologyId,
        question: 'Do you support the initiative to provide free public Wi-Fi in key areas of the city?',
      },
      {
        localityId: localId,
        categoryId: technologyId,
        question:
          'Should the city invest in smart technology to improve public services (e.g., waste management, water supply)?',
      },
      {
        localityId: localId,
        categoryId: cultureId,
        question: 'Do you believe in increasing funding for local arts and cultural programs?',
      },
      {
        localityId: localId,
        categoryId: cultureId,
        question: 'Should the city sponsor annual community events to promote local businesses and tourism?',
      },
      {
        localityId: stateId,
        categoryId: educationId,
        question: 'Should the state increase funding for K-12 public education?',
      },
      {
        localityId: stateId,
        categoryId: educationId,
        question: 'Do you support state-funded scholarship programs for higher education?',
      },
      {
        localityId: stateId,
        categoryId: healthId,
        question:
          'Should the state expand Medicaid to provide more low-income individuals and families with health coverage?',
      },
      {
        localityId: stateId,
        categoryId: healthId,
        question: 'Do you believe in implementing state-level regulations to reduce prescription drug prices?',
      },
      {
        localityId: stateId,
        categoryId: economicId,
        question: 'Do you support raising the minimum wage to a livable standard within the state?',
      },
      {
        localityId: stateId,
        categoryId: economicId,
        question: 'Should the state offer tax incentives to businesses that implement green technologies?',
      },
      {
        localityId: stateId,
        categoryId: environmentId,
        question: 'Do you support state-level initiatives to reduce carbon emissions and combat climate change?',
      },
      {
        localityId: stateId,
        categoryId: environmentId,
        question: 'Should the state allocate funds to protect and restore natural habitats and wildlife?',
      },
      {
        localityId: stateId,
        categoryId: justiceId,
        question:
          "Do you believe in reforming the state's criminal justice system to focus more on rehabilitation than punishment?",
      },
      {
        localityId: stateId,
        categoryId: justiceId,
        question: 'Should the state enforce stricter gun control laws?',
      },
      {
        localityId: stateId,
        categoryId: infrastructureId,
        question: 'Do you support increased state investment in public transportation infrastructure?',
      },
      {
        localityId: stateId,
        categoryId: infrastructureId,
        question: 'Should the state allocate more resources to improving broadband internet access in rural areas?',
      },
      {
        localityId: stateId,
        categoryId: socialId,
        question: 'Do you support the legalization of marijuana for recreational use?',
      },
      {
        localityId: stateId,
        categoryId: socialId,
        question: 'Should the state protect the right to abortion access?',
      },
      {
        localityId: stateId,
        categoryId: employmentId,
        question: 'Do you support state policies that encourage the creation of more union jobs?',
      },
      {
        localityId: stateId,
        categoryId: employmentId,
        question: 'Should the state require paid family leave for all employees?',
      },
      {
        localityId: stateId,
        categoryId: taxesId,
        question: 'Do you believe in increasing state taxes on the wealthy to fund public services?',
      },
      {
        localityId: stateId,
        categoryId: taxesId,
        question: 'Should the state prioritize funding for renewable energy projects over fossil fuels?',
      },
      {
        localityId: federalId,
        categoryId: economicId,
        question: 'Do you support the implementation of a nationwide minimum wage increase?',
      },
      {
        localityId: federalId,
        categoryId: economicId,
        question:
          'Should the federal government implement more stringent regulations on Wall Street and financial institutions?',
      },
      {
        localityId: federalId,
        categoryId: healthId,
        question: 'Do you believe in a single-payer healthcare system as a solution for the United States?',
      },
      {
        localityId: federalId,
        categoryId: healthId,
        question: 'Should the federal government take steps to lower the cost of prescription drugs?',
      },
      {
        localityId: federalId,
        categoryId: environmentId,
        question:
          'Do you support the United States rejoining international agreements focused on combating climate change?',
      },
      {
        localityId: federalId,
        categoryId: environmentId,
        question:
          'Should the federal government invest in renewable energy sources to reduce dependence on fossil fuels?',
      },
      {
        localityId: federalId,
        categoryId: defenseId,
        question: 'Do you believe in increasing the defense budget to enhance national security?',
      },
      {
        localityId: federalId,
        categoryId: defenseId,
        question: 'Should the United States reduce its military presence overseas?',
      },
      {
        localityId: federalId,
        categoryId: socialId,
        question: 'Do you support nationwide legalization of same-sex marriage?',
      },
      {
        localityId: federalId,
        categoryId: socialId,
        question: 'Should the federal government enforce stricter gun control laws?',
      },
      {
        localityId: federalId,
        categoryId: immigrationId,
        question:
          'Do you support a path to citizenship for undocumented immigrants currently living in the United States?',
      },
      {
        localityId: federalId,
        categoryId: immigrationId,
        question: 'Should the federal government increase funding for border security?',
      },
      {
        localityId: federalId,
        categoryId: educationId,
        question: 'Do you believe in making public college tuition-free for all Americans?',
      },
      {
        localityId: federalId,
        categoryId: educationId,
        question: 'Should the federal government forgive student loan debt?',
      },
      {
        localityId: federalId,
        categoryId: employmentId,
        question:
          "Do you support the expansion of federal programs to protect workers' rights and promote job creation?",
      },
      {
        localityId: federalId,
        categoryId: employmentId,
        question: 'Should the federal government mandate paid parental leave?',
      },
      {
        localityId: federalId,
        categoryId: taxesId,
        question: 'Do you support reforming the tax code to ensure higher taxes on the wealthiest Americans?',
      },
      {
        localityId: federalId,
        categoryId: taxesId,
        question: 'Should the federal government provide more tax incentives for small businesses?',
      },
      {
        localityId: federalId,
        categoryId: rightsId,
        question: 'Do you believe the federal government should play a larger role in protecting voting rights?',
      },
      {
        localityId: federalId,
        categoryId: rightsId,
        question: 'Should the federal government enact more comprehensive anti-discrimination laws?',
      },
    ])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('Question').execute();
  await db.schema.dropTable('Locality').execute();
  await db.schema.dropTable('Category').execute();
}
