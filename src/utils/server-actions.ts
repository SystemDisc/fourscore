'use server';

import { AnswerUpdate, NewAddress, NewAnswer, db } from '@/db/database';
import { Simplify, sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DefaultSession } from 'next-auth';

export const saveAddress = async (user: DefaultSession['user'], {
  streetNumber,
  route,
  city,
  state,
  zip,
}: NewAddress) => {
  const currentUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const existingAddress = await db.selectFrom('Address')
    .where('userId', '=', currentUser.id)
    .selectAll()
    .executeTakeFirst();

  if (existingAddress) {
    existingAddress.streetNumber = streetNumber || null;
    existingAddress.route = route || null;
    existingAddress.city = city || null;
    existingAddress.state = state || null;
    existingAddress.zip = zip || null;

    await db.updateTable('Address')
      .where('id', '=', existingAddress.id)
      .set(existingAddress)
      .execute();
  } else {
    await db.insertInto('Address').values({
      userId: currentUser.id,
      streetNumber: streetNumber || null,
      route: route || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
    }).execute();
  }

  return await db.selectFrom('Address')
    .where('userId', '=', currentUser.id)
    .selectAll()
    .executeTakeFirst();
};

export const getPoll = async (user: DefaultSession['user']) => {
  const currentUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!currentUser) {
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
          .where('Answer.userId', '=', currentUser.id)
          .whereRef('Answer.questionId', '=', 'Question.id')
      ).as('answer'),
    ])
    .orderBy(['Locality.position asc', 'Category.name asc'])
    .execute();

  const allAnswers = await db.selectFrom('Answer')
    .select((eb) => [
      'Answer.questionId',
      eb.fn<string>('count', [sql`case when agree IS TRUE then agree end`]).as('yesCount'),
      eb.fn<string>('count', [sql`case when agree IS FALSE then agree end`]).as('noCount'),
    ])
    .groupBy('questionId')
    .execute();

  return {
    questions,
    allAnswers,
  };
};

export const savePoll = async (user: DefaultSession['user'], answers: Simplify<AnswerUpdate>[]) => {
  const currentUser = await db.selectFrom('User')
    .where('email', '=', user?.email!)
    .selectAll()
    .executeTakeFirst();

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const existingAnswers = await db.selectFrom('Answer')
    .selectAll()
    .where('userId', '=', currentUser.id)
    .execute();

  const oldAnswers = answers.filter((a) => existingAnswers.find((ea) => ea.questionId === a.questionId));
  const obsoleteAnswers = existingAnswers.filter((a) => !answers.find((ea) => ea.questionId === a.questionId));
  const newAnswers = answers.filter((a) => !existingAnswers.find((ea) => ea.questionId === a.questionId))
    .filter((a) => typeof a.agree !== 'undefined' && typeof a.rating !== 'undefined');

  for (const oldAnswer of oldAnswers) {
    const existingAnswer = existingAnswers.find((a) => a.questionId === oldAnswer.questionId);
    if (oldAnswer.agree === existingAnswer?.agree && oldAnswer.rating === existingAnswer?.rating) {
      continue;
    }
    await db.updateTable('Answer')
      .set({
        ...oldAnswer,
        dateUpdated: new Date(),
      })
      .where('userId', '=', currentUser.id)
      .where('questionId', '=', oldAnswer.questionId!)
      .execute();
  }

  if (obsoleteAnswers.length) {
    await db.deleteFrom('Answer')
      .where('userId', '=', currentUser.id)
      .where('questionId', 'in', obsoleteAnswers.map((oa) => oa.questionId))
      .execute();
  }

  if (newAnswers.length) {
    await db.insertInto('Answer')
      .values(newAnswers.map(({ questionId, agree, rating }) => ({
        userId: currentUser.id,
        questionId,
        agree: agree!,
        rating: rating!,
        dateUpdated: new Date(),
      } as NewAnswer)))
      .execute();
  }
};

export const calculateMatches = async (user: DefaultSession['user']) => {
  if (!user || !user.email) {
    throw new Error('Not logged in.');
  }

  const currentUser = await db.selectFrom('User')
    .selectAll('User')
    .leftJoin('Answer', 'Answer.userId', 'User.id')
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom('Answer')
          .selectAll('Answer')
          .whereRef('Answer.userId', '=', 'User.id'),
      ).as('answers'),
      eb.val(0).as('questionsAnswered'),
      eb.val(0).as('questionsTotal'),
    ])
    .where('User.email', '=', user.email)
    .executeTakeFirst();

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const { questions } = await getPoll(user);

  currentUser.questionsTotal = questions.length;
  currentUser.questionsAnswered = questions.map((q) => q.answer).filter((a) => a).length;

  const candidates = await db.selectFrom(['User', 'CandidateOffice'])
    .selectAll('User')
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom(['Office', 'CandidateOffice'])
          .selectAll('Office')
          .whereRef('Office.id', '=', 'CandidateOffice.officeId'),
      ).as('offices'),
      jsonArrayFrom(
        eb
          .selectFrom('Answer')
          .selectAll('Answer')
          .whereRef('Answer.userId', '=', 'User.id'),
      ).as('answers'),
      jsonObjectFrom(
        eb
          .selectFrom('CandidateUserScore')
          .selectAll('CandidateUserScore')
          .where('CandidateUserScore.userId', '=', currentUser.id)
          .whereRef('CandidateUserScore.candidateId', '=', 'User.id'),
      ).as('candidateUserScore'),
      eb.val(0).as('score'),
    ])
    .whereRef('CandidateOffice.userId', '=', 'User.id')
    .execute();

  for (const candidate of candidates) {
    let sameScore = 0;
    let diffScore = 0;

    const lastUpdatedUserAnswer = currentUser.answers.reduce(
      (max, answer) =>
        Math.max(answer.dateUpdated ? new Date(answer.dateUpdated).getTime() : 0, max),
      0
    );
    const lastUpdatedCandidateAnswer = candidate.answers.reduce(
      (max, answer) =>
        Math.max(answer.dateUpdated ? new Date(answer.dateUpdated).getTime() : 0, max),
      0
    );

    const scoreUpdated = candidate.candidateUserScore ? new Date(candidate.candidateUserScore.dateUpdated).getTime() : 0;

    if (
      !candidate.candidateUserScore ||
      scoreUpdated <= lastUpdatedUserAnswer ||
      scoreUpdated <= lastUpdatedCandidateAnswer
    ) {
      if (candidate.answers.length === 0) {
        candidate.score = 0;
      }

      for (const userAnswer of currentUser.answers) {
        const candidateAnswer = candidate.answers.find((a) => a.questionId === userAnswer.questionId);

        const userRating = (userAnswer.rating || 1);

        if (!candidateAnswer) {
          diffScore += userRating;
          continue;
        }

        const candidateRating = (candidateAnswer.rating || 1);

        if (userAnswer.agree === candidateAnswer.agree) {
          sameScore += userRating;
          const ratingDiff = userRating - candidateRating;
          if (ratingDiff > 0) {
            diffScore += ratingDiff;
          }
        } else {
          diffScore += userRating;
        }
      }

      candidate.score = Math.round(sameScore / (sameScore + diffScore) * 10000) / 100;

      if (candidate.candidateUserScore) {
        const candidateUserScore = await db.updateTable('CandidateUserScore')
          .set({
            score: candidate.score,
            dateUpdated: new Date(),
          })
          .where('CandidateUserScore.userId', '=', currentUser.id)
          .where('CandidateUserScore.candidateId', '=', candidate.id)
          .returningAll()
          .executeTakeFirst();
        candidateUserScore!.score = +candidateUserScore!.score;
        candidate.candidateUserScore = candidateUserScore!;
      } else {
        const candidateUserScore = await db.insertInto('CandidateUserScore')
          .values({
            userId: currentUser.id,
            candidateId: candidate.id,
            score: candidate.score,
            dateUpdated: new Date(),
          })
          .returningAll()
          .executeTakeFirst();
        candidateUserScore!.score = +candidateUserScore!.score;
        candidate.candidateUserScore = candidateUserScore!;
      }
    } else {
      candidate.score = isNaN(candidate.candidateUserScore.score) ? 0 : candidate.candidateUserScore.score;
    }
  }

  return {
    currentUser,
    candidates: candidates.sort((a, b) => b.score - a.score),
  };
};
