import { Kysely } from 'kysely';
import { Database } from '../database';

export async function up(db: Kysely<Database>) {
  await db
    .deleteFrom('Account')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db.schema
    .alterTable('Account')
    .addForeignKeyConstraint('fk_Account_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('Session')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db.schema
    .alterTable('Session')
    .addForeignKeyConstraint('fk_Session_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('Address')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db.schema
    .alterTable('Address')
    .addForeignKeyConstraint('fk_Address_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('Answer')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db
    .deleteFrom('Answer')
    .whereRef('questionId', 'not in', (qb) => qb.selectFrom('Question').select('Question.id'))
    .execute();
  await db.schema
    .alterTable('Answer')
    .addForeignKeyConstraint('fk_Answer_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
  await db.schema
    .alterTable('Answer')
    .addForeignKeyConstraint('fk_Answer_questionId', ['questionId'], 'Question', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('CandidateOffice')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db
    .deleteFrom('CandidateOffice')
    .whereRef('officeId', 'not in', (qb) => qb.selectFrom('Office').select('Office.id'))
    .execute();
  await db.schema
    .alterTable('CandidateOffice')
    .addForeignKeyConstraint('fk_CandidateOffice_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
  await db.schema
    .alterTable('CandidateOffice')
    .addForeignKeyConstraint('fk_CandidateOffice_officeId', ['officeId'], 'Office', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('CandidateUserScore')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db
    .deleteFrom('CandidateUserScore')
    .whereRef('candidateId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db.schema
    .alterTable('CandidateUserScore')
    .addForeignKeyConstraint('fk_CandidateUserScore_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
  await db.schema
    .alterTable('CandidateUserScore')
    .addForeignKeyConstraint('fk_CandidateUserScore_candidateId', ['candidateId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('CandidateData')
    .whereRef('userId', 'not in', (qb) => qb.selectFrom('User').select('User.id'))
    .execute();
  await db.schema
    .alterTable('CandidateData')
    .addForeignKeyConstraint('fk_CandidateData_userId', ['userId'], 'User', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('Question')
    .whereRef('localityId', 'not in', (qb) => qb.selectFrom('Locality').select('Locality.id'))
    .execute();
  await db
    .deleteFrom('Question')
    .whereRef('categoryId', 'not in', (qb) => qb.selectFrom('Category').select('Category.id'))
    .execute();
  await db.schema
    .alterTable('Question')
    .addForeignKeyConstraint('fk_Question_localityId', ['localityId'], 'Locality', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
  await db.schema
    .alterTable('Question')
    .addForeignKeyConstraint('fk_Question_categoryId', ['categoryId'], 'Category', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .deleteFrom('Office')
    .whereRef('localityId', 'not in', (qb) => qb.selectFrom('Locality').select('Locality.id'))
    .execute();
  await db.schema
    .alterTable('Office')
    .addForeignKeyConstraint('fk_Office_localityId', ['localityId'], 'Locality', ['id'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.alterTable('Account').dropConstraint('fk_Account_userId').execute();
  await db.schema.alterTable('Session').dropConstraint('fk_Session_userId').execute();
  await db.schema.alterTable('Address').dropConstraint('fk_Address_userId').execute();
  await db.schema.alterTable('Answer').dropConstraint('fk_Answer_userId').execute();
  await db.schema.alterTable('Answer').dropConstraint('fk_Answer_questionId').execute();
  await db.schema.alterTable('CandidateOffice').dropConstraint('fk_CandidateOffice_userId').execute();
  await db.schema.alterTable('CandidateOffice').dropConstraint('fk_CandidateOffice_officeId').execute();
  await db.schema.alterTable('CandidateUserScore').dropConstraint('fk_CandidateUserScore_userId').execute();
  await db.schema.alterTable('CandidateUserScore').dropConstraint('fk_CandidateUserScore_candidateId').execute();
  await db.schema.alterTable('CandidateData').dropConstraint('fk_CandidateData_userId').execute();
  await db.schema.alterTable('Question').dropConstraint('fk_Question_localityId').execute();
  await db.schema.alterTable('Question').dropConstraint('fk_Question_categoryId').execute();
  await db.schema.alterTable('Office').dropConstraint('fk_Office_localityId').execute();
}
