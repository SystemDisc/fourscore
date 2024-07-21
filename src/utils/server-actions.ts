'use server';

import { Answer, AnswerUpdate, NewAddress, NewAnswer, User, db } from '@/db/database';
import { CandidateResult, CategoryWithQuestionsAndScore, Nullable, UserWithAnswers } from '@/types';
import { Simplify, sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DefaultSession } from 'next-auth';

const userCache = new Map<string, Simplify<User>>();

export const getUserByEmail = async (email?: string | null) => {
  if (!email) {
    throw new Error('User email missing.');
  }

  if (userCache.has(email)) {
    return userCache.get(email)!;
  } else {
    const currentUser = await db.selectFrom('User').where('email', '=', email).selectAll().executeTakeFirst();

    if (!currentUser) {
      throw new Error('User not found.');
    }

    return currentUser;
  }
};

export const saveAddress = async (
  user: DefaultSession['user'],
  { streetNumber, route, city, state, zip }: NewAddress,
) => {
  const currentUser = await getUserByEmail(user?.email);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const existingAddress = await db
    .selectFrom('Address')
    .where('userId', '=', currentUser.id)
    .selectAll()
    .executeTakeFirst();

  if (existingAddress) {
    existingAddress.streetNumber = streetNumber || null;
    existingAddress.route = route || null;
    existingAddress.city = city || null;
    existingAddress.state = state || null;
    existingAddress.zip = zip || null;

    await db.updateTable('Address').where('id', '=', existingAddress.id).set(existingAddress).execute();
  } else {
    await db
      .insertInto('Address')
      .values({
        userId: currentUser.id,
        streetNumber: streetNumber || null,
        route: route || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
      })
      .execute();
  }

  return await db.selectFrom('Address').where('userId', '=', currentUser.id).selectAll().executeTakeFirst();
};

export const getQuestions = async (user: DefaultSession['user']) => {
  const currentUser = await getUserByEmail(user?.email);

  return await db
    .selectFrom('Question')
    .innerJoin('Locality', 'Locality.id', 'Question.localityId')
    .innerJoin('Category', 'Category.id', 'Question.categoryId')
    .selectAll('Question')
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom('Locality').selectAll('Locality').whereRef('Locality.id', '=', 'Question.localityId'),
      ).as('locality'),
      jsonObjectFrom(
        eb.selectFrom('Category').selectAll('Category').whereRef('Category.id', '=', 'Question.categoryId'),
      ).as('category'),
      jsonObjectFrom(
        eb
          .selectFrom('Answer')
          .selectAll('Answer')
          .where('Answer.userId', '=', currentUser.id)
          .whereRef('Answer.questionId', '=', 'Question.id'),
      ).as('answer'),
    ])
    .orderBy(['Locality.position asc', 'Category.name asc'])
    .execute();
};

export const getPoll = async (user: DefaultSession['user']) => {
  const currentUser = await getUserByEmail(user?.email);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const questions = await getQuestions(currentUser);

  const allAnswers = await db
    .selectFrom('Answer')
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
  const currentUser = await getUserByEmail(user?.email);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const existingAnswers = await db.selectFrom('Answer').selectAll().where('userId', '=', currentUser.id).execute();

  const oldAnswers = answers.filter((a) => existingAnswers.find((ea) => ea.questionId === a.questionId));
  const obsoleteAnswers = existingAnswers.filter((a) => !answers.find((ea) => ea.questionId === a.questionId));
  const newAnswers = answers
    .filter((a) => !existingAnswers.find((ea) => ea.questionId === a.questionId))
    .filter((a) => typeof a.agree !== 'undefined' && typeof a.rating !== 'undefined');

  for (const oldAnswer of oldAnswers) {
    const existingAnswer = existingAnswers.find((a) => a.questionId === oldAnswer.questionId);
    if (oldAnswer.agree === existingAnswer?.agree && oldAnswer.rating === existingAnswer?.rating) {
      continue;
    }
    await db
      .updateTable('Answer')
      .set({
        ...oldAnswer,
        dateUpdated: new Date(),
      })
      .where('userId', '=', currentUser.id)
      .where('questionId', '=', oldAnswer.questionId!)
      .execute();
  }

  if (obsoleteAnswers.length) {
    await db
      .deleteFrom('Answer')
      .where('userId', '=', currentUser.id)
      .where(
        'questionId',
        'in',
        obsoleteAnswers.map((oa) => oa.questionId),
      )
      .execute();
  }

  if (newAnswers.length) {
    await db
      .insertInto('Answer')
      .values(
        newAnswers.map(
          ({ questionId, agree, rating }) =>
            ({
              userId: currentUser.id,
              questionId,
              agree: agree!,
              rating: rating!,
              dateUpdated: new Date(),
            }) as NewAnswer,
        ),
      )
      .execute();
  }
};

export const calculateScore = async (userAnswers: Nullable<Answer>[], candidateAnswers: Nullable<Answer>[]) => {
  let sameScore = 0;
  let diffScore = 0;

  if (candidateAnswers.length === 0) {
    return 0;
  }

  for (const userAnswer of userAnswers) {
    const candidateAnswer = candidateAnswers.find((a) => a.questionId === userAnswer.questionId);

    const userRating = userAnswer.rating || 1;

    if (!candidateAnswer) {
      diffScore += userRating;
      continue;
    }

    const candidateRating = candidateAnswer.rating || 1;

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

  return Math.round((sameScore / (sameScore + diffScore)) * 10000) / 100;
};

export const calculateMatches = async (user: DefaultSession['user']) => {
  if (!user || !user.email) {
    throw new Error('Not logged in.');
  }

  const currentUser = await getUserByEmail(user?.email);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const currentUserWithAnswers: UserWithAnswers = {
    ...currentUser,
    answers: await db.selectFrom('Answer').selectAll().where('userId', '=', currentUser.id).execute(),
    questionsAnswered: 0,
    questionsTotal: 0,
  };

  const questions = await getQuestions(user);

  currentUserWithAnswers.questionsAnswered = questions.map((q) => q.answer).filter((a) => a).length;
  currentUserWithAnswers.questionsTotal = questions.length;

  const candidates: CandidateResult[] = await db
    .selectFrom(['User', 'CandidateOffice'])
    .selectAll('User')
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom(['Office', 'CandidateOffice'])
          .selectAll('Office')
          .whereRef('Office.id', '=', 'CandidateOffice.officeId'),
      ).as('offices'),
      jsonArrayFrom(eb.selectFrom('Answer').selectAll('Answer').whereRef('Answer.userId', '=', 'User.id')).as(
        'answers',
      ),
      jsonObjectFrom(
        eb
          .selectFrom('CandidateUserScore')
          .selectAll('CandidateUserScore')
          .where('CandidateUserScore.userId', '=', currentUserWithAnswers.id)
          .whereRef('CandidateUserScore.candidateId', '=', 'User.id'),
      ).as('candidateUserScore'),
      eb.val(0).as('score'),
    ])
    .whereRef('CandidateOffice.userId', '=', 'User.id')
    .execute();

  for (const candidate of candidates) {
    const lastUpdatedUserAnswer = currentUserWithAnswers.answers.reduce(
      (max, answer) => Math.max(answer.dateUpdated ? new Date(answer.dateUpdated).getTime() : 0, max),
      0,
    );
    const lastUpdatedCandidateAnswer = candidate.answers.reduce(
      (max, answer) => Math.max(answer.dateUpdated ? new Date(answer.dateUpdated).getTime() : 0, max),
      0,
    );

    const scoreUpdated = candidate.candidateUserScore?.dateUpdated
      ? new Date(candidate.candidateUserScore.dateUpdated).getTime()
      : 0;

    if (
      !candidate.candidateUserScore ||
      scoreUpdated <= lastUpdatedUserAnswer ||
      scoreUpdated <= lastUpdatedCandidateAnswer
    ) {
      candidate.score = await calculateScore(currentUserWithAnswers.answers, candidate.answers);

      if (candidate.candidateUserScore) {
        const candidateUserScore = await db
          .updateTable('CandidateUserScore')
          .set({
            score: candidate.score,
            dateUpdated: new Date(),
          })
          .where('CandidateUserScore.userId', '=', currentUserWithAnswers.id)
          .where('CandidateUserScore.candidateId', '=', candidate.id)
          .returningAll()
          .executeTakeFirst();
        candidateUserScore!.score = +candidateUserScore!.score;
        candidate.candidateUserScore = candidateUserScore!;
      } else {
        const candidateUserScore = await db
          .insertInto('CandidateUserScore')
          .values({
            userId: currentUserWithAnswers.id,
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
      candidate.score = isNaN(candidate.candidateUserScore.score || 0) ? 0 : candidate.candidateUserScore.score || 0;
    }
  }

  return {
    questions,
    currentUser: currentUserWithAnswers,
    candidates: candidates.sort((a, b) => b.score - a.score),
  };
};

export const deleteUser = async (user: DefaultSession['user']) => {
  const currentUser = await db.selectFrom('User').where('email', '=', user?.email!).selectAll().executeTakeFirst();

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  await db.deleteFrom('User').where('id', '=', currentUser.id).execute();

  await db.deleteFrom('Account').where('userId', '=', currentUser.id).execute();

  await db.deleteFrom('Address').where('userId', '=', currentUser.id).execute();

  await db.deleteFrom('Answer').where('userId', '=', currentUser.id).execute();

  await db.deleteFrom('CandidateOffice').where('userId', '=', currentUser.id).execute();

  await db.deleteFrom('CandidateUserScore').where('userId', '=', currentUser.id).execute();

  await db.deleteFrom('Session').where('userId', '=', currentUser.id).execute();
};

export const getUser = async (user: DefaultSession['user']) => {
  const currentUser = await db.selectFrom('User').where('email', '=', user?.email!).selectAll().executeTakeFirst();

  return currentUser;
};

export const markTutorialShown = async (user: DefaultSession['user']) => {
  if (!user?.email) {
    return {
      error: 'Issue with logged in user.',
    };
  }

  await db
    .updateTable('User')
    .set({
      seenVotingTutorial: true,
    })
    .where('email', '=', user.email)
    .execute();

  return {
    success: 'User updated.',
  };
};

export const getCandidateAnswerScore = async (user: DefaultSession['user'], candidateId: string) => {
  const currentUser = await getUserByEmail(user?.email);

  const userQuestionCategories = await db
    .selectFrom('Category')
    .selectAll('Category')
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom('Question')
          .selectAll()
          .whereRef('Question.categoryId', '=', 'Category.id')
          .select((eb) => [
            jsonObjectFrom(
              eb
                .selectFrom('Answer')
                .selectAll()
                .whereRef('Answer.questionId', '=', 'Question.id')
                .where('Answer.userId', '=', currentUser.id),
            ).as('answer'),
          ]),
      ).as('questions'),
    ])
    .groupBy('Category.id')
    .execute();

  const candidateQuestionCategories = await db
    .selectFrom('Category')
    .selectAll('Category')
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom('Question')
          .selectAll()
          .whereRef('Question.categoryId', '=', 'Category.id')
          .select((eb) => [
            jsonObjectFrom(
              eb
                .selectFrom('Answer')
                .selectAll()
                .whereRef('Answer.questionId', '=', 'Question.id')
                .where('Answer.userId', '=', candidateId),
            ).as('answer'),
          ]),
      ).as('questions'),
    ])
    .execute();

  const candidateQuestionCategoriesWithScore = await candidateQuestionCategories.reduce(
    async (candidateCategories, candidateCategory) => {
      const userCategory = userQuestionCategories.find((c) => c.id === candidateCategory.id);
      const userAnswers = userCategory?.questions.filter((q) => q.answer).map((q) => q.answer!) || [];
      const candidateAnswers = candidateCategory.questions.filter((q) => q.answer).map((q) => q.answer!) || [];

      const similarityScore = await calculateScore(userAnswers, candidateAnswers);

      return [
        ...(await candidateCategories),
        {
          ...candidateCategory,
          similarityScore,
        },
      ];
    },
    Promise.resolve([] as CategoryWithQuestionsAndScore[]),
  );

  return candidateQuestionCategoriesWithScore;
};

export const getCandidateSingleCategoryAnswerScore = async (id: string, categoryId: string) => {
  // category id
  const answers = await getCandidateAnswersForCategory(id, categoryId);
  const totalNumOfCategoryQuestions = await db.selectFrom('Question').where('categoryId', '=', categoryId).execute();

  const totalQuestionsCount = Number(totalNumOfCategoryQuestions.length);

  let similarityScore = 0;
  answers.forEach((answer) => {
    const accum = answer.agree ? 1 : 0;
    similarityScore += accum * (answer.rating || 0);
  });

  similarityScore = (similarityScore / (totalQuestionsCount * 5)) * 100;
  similarityScore = Math.max(similarityScore, 0);

  return similarityScore;
};

export const getCandidateAnswers = async (id: string) => {
  const answers = await db
    .selectFrom('Answer')
    .where('Answer.userId', '=', id)
    .leftJoin('Question', 'Question.id', 'Answer.questionId')
    .leftJoin('Category', 'Category.id', 'Question.categoryId')
    .select(['Answer.userId', 'Answer.questionId', 'Category.id', 'Category.name', 'Answer.agree', 'Answer.rating'])
    .execute();

  return answers;
};

export const getCandidateAnswersForCategory = async (id: string, categoryId: string) => {
  const answers = await db
    .selectFrom('Answer')
    .where('Answer.userId', '=', id)
    .leftJoin('Question', 'Question.id', 'Answer.questionId')
    .leftJoin('Category', 'Category.id', 'Question.categoryId')
    .where('Question.categoryId', '=', categoryId)
    .select(['Answer.userId', 'Answer.questionId', 'Category.id', 'Category.name', 'Answer.agree', 'Answer.rating'])
    .execute();

  return answers;
};

export const getAnswerForSingleCategory = async (id?: string, categoryId?: string) => {
  const currentUser = await db.selectFrom('User').where('id', '=', id!).selectAll().executeTakeFirst();

  if (!currentUser || !categoryId) {
    throw new Error('Incorrect request');
  }

  const category = await db.selectFrom('Category').where('Category.id', '=', categoryId).selectAll().executeTakeFirst();

  const answers = await db
    .selectFrom('Answer')
    .where('Answer.userId', '=', currentUser.id)
    .leftJoin('Question', 'Question.id', 'Answer.questionId')
    .leftJoin('Category', 'Category.id', 'Question.categoryId')
    .where('Category.id', '=', categoryId)
    .select([
      'Answer.id',
      'Answer.agree',
      'Question.question',
      'Answer.rating',
      'Answer.questionId',
      'Answer.notes',
      'Answer.dateUpdated',
    ])
    .execute();

  return {
    currentUser,
    category,
    answers,
  };
};
