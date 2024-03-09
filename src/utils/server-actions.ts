'use server';

import { NewAddress, db } from '@/db/database';
import { Answer } from '@/types';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DefaultSession } from 'next-auth';

export const saveAddress = async (user: DefaultSession['user'], {
  streetNumber,
  route,
  city,
  state,
  zip,
}: NewAddress) => {
  const existingUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!existingUser) {
    throw new Error('Not logged in.');
  }

  const existingAddress = await db.selectFrom('Address')
    .where('userId', '=', existingUser.id)
    .selectAll()
    .executeTakeFirst();

  if (existingAddress) {
    existingAddress.streetNumber = streetNumber;
    existingAddress.route = route;
    existingAddress.city = city;
    existingAddress.state = state;
    existingAddress.zip = zip;

    await db.updateTable('Address')
      .where('id', '=', existingAddress.id)
      .set(existingAddress)
      .execute();
  } else {
    await db.insertInto('Address').values({
      userId: existingUser.id,
      streetNumber,
      route,
      city,
      state,
      zip,
    }).execute();
  }

  return await db.selectFrom('Address')
    .where('userId', '=', existingUser.id)
    .selectAll()
    .executeTakeFirst();
};

export const getPoll = async (user: DefaultSession['user']) => {
  const existingUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!existingUser) {
    throw new Error('Not logged in.');
  }

  const questions = await db.selectFrom('Question')
    .innerJoin('Locality', 'Locality.id', 'Question.localityId')
    .innerJoin('Category', 'Category.id', 'Question.categoryId')
    .selectAll('Question')
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('Locality')
          .selectAll('Locality')
          .whereRef('Locality.id', '=', 'Question.localityId')
      ).as('locality'),
      jsonObjectFrom(
        eb
          .selectFrom('Category')
          .selectAll('Category')
          .whereRef('Category.id', '=', 'Question.categoryId')
      ).as('category'),
      jsonObjectFrom(
        eb
          .selectFrom('Answer')
          .selectAll('Answer')
          .where('Answer.userId', '=', existingUser.id)
          .whereRef('Answer.questionId', '=', 'Question.id')
      ).as('answer'),
    ])
    .orderBy(['Locality.position asc', 'Category.name asc'])
    .execute();

  return questions;
};

export const savePoll = async (user: DefaultSession['user'], answers: Answer[]) => {
  const existingUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!existingUser) {
    throw new Error('Not logged in.');
  }

  const existingAnswers = await db.selectFrom('Answer')
    .selectAll()
    .where('userId', '=', existingUser.id)
    .execute();

  const oldAnswers = answers.filter((a) => existingAnswers.find((ea) => ea.questionId === a.questionId));
  const obsoleteAnswers = existingAnswers.filter((a) => !answers.find((ea) => ea.questionId === a.questionId));
  const newAnswers = answers.filter((a) => !existingAnswers.find((ea) => ea.questionId === a.questionId))
    .filter((a) => a.agree && a.rating);

  for (const oldAnswer of oldAnswers) {
    await db.updateTable('Answer')
      .set(oldAnswer)
      .where('userId', '=', existingUser.id)
      .where('questionId', '=', oldAnswer.questionId)
      .execute();
  }

  if (obsoleteAnswers.length) {
    await db.deleteFrom('Answer')
      .where('userId', '=', existingUser.id)
      .where('questionId', 'in', obsoleteAnswers.map((oa) => oa.questionId))
      .execute();
  }

  if (newAnswers.length) {
    await db.insertInto('Answer')
      .values(newAnswers.map(({ questionId, agree, rating }) => ({
        userId: existingUser.id,
        questionId,
        agree: agree!,
        rating: rating!,
      })))
      .execute();
  }
};
