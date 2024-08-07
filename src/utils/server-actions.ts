'use server';

import { Answer, AnswerUpdate, Database, NewAddress, NewAnswer, User, db } from '@/db/database';
import { CandidateResult, CategoryWithQuestionsAndScore, Nullable, UserWithAnswers } from '@/types';
import { ExpressionBuilder, Kysely, Simplify, sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { DefaultSession } from 'next-auth';

const userCache = new Map<string, Simplify<User>>();

export const saveAddress = async (
  user: DefaultSession['user'],
  { streetNumber, route, city, state, zip }: NewAddress,
) => {
  const currentUser = await getUser(user);

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
  const currentUser = await getUser(user);

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
      currentUser
        ? jsonObjectFrom(
            eb
              .selectFrom('Answer')
              .selectAll('Answer')
              .where('Answer.userId', '=', currentUser.id)
              .whereRef('Answer.questionId', '=', 'Question.id'),
          ).as('answer')
        : eb.val(null).as('answer'),
    ])
    .orderBy(['Locality.position asc', 'Category.name asc'])
    .execute();
};

export const getPoll = async (user: DefaultSession['user']) => {
  const currentUser = await getUser(user);

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
  const currentUser = await getUser(user);

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
            } as NewAnswer),
        ),
      )
      .execute();
  }
};

export const calculateScore = async (userAnswers: Nullable<Answer>[], candidateAnswers: Nullable<Answer>[]) => {
  let sameScore = 0;
  let diffScore = 0;

  if (userAnswers.length === 0) {
    return NaN;
  }

  if (candidateAnswers.length === 0) {
    return -1;
  }

  if (userAnswers.length > 0 && candidateAnswers.length === 0) {
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

  const total = sameScore + diffScore;
  return total === 0 ? NaN : Math.round((sameScore / total) * 10000) / 100;
};

export const calculateMatches = async (user: DefaultSession['user']) => {
  if (!user || !user.email) {
    throw new Error('Not logged in.');
  }

  const currentUser = await getUser(user);

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
      jsonObjectFrom(
        eb.selectFrom('CandidateData').selectAll('CandidateData').whereRef('CandidateData.userId', '=', 'User.id'),
      ).as('candidateData'),
      jsonArrayFrom(
        eb
          .selectFrom(['Office', 'CandidateOffice'])
          .selectAll('Office')
          .whereRef('Office.id', '=', 'CandidateOffice.officeId'),
      ).as('offices'),
      jsonArrayFrom(eb.selectFrom('Answer').selectAll('Answer').whereRef('Answer.userId', '=', 'User.id')).as(
        'answers',
      ),
      jsonArrayFrom(eb.selectFrom('Question').selectAll('Question')).as('questions'),
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
        candidateUserScore!.score = candidateUserScore!.score;
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
        candidateUserScore!.score = candidateUserScore!.score;
        candidate.candidateUserScore = candidateUserScore!;
      }
    } else {
      candidate.score = candidate.candidateUserScore.score;
    }
  }

  return {
    questions,
    currentUser: currentUserWithAnswers,
    candidates: candidates.sort((a, b) => (b.score || 0) - (a.score || 0)),
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

  if (!currentUser) {
    return currentUser;
  }

  if (userCache.has(currentUser.email)) {
    return userCache.get(currentUser.email)!;
  }

  userCache.set(currentUser.email, currentUser);
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

function chainQuestionsByCategory<T extends keyof Database>(
  qb: ExpressionBuilder<Database, T> | Kysely<Database>,
  userId?: string,
) {
  return (qb as Kysely<Database>)
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
              userId
                ? eb
                    .selectFrom('Answer')
                    .selectAll()
                    .whereRef('Answer.questionId', '=', 'Question.id')
                    .where('Answer.userId', '=', userId)
                : eb
                    .selectFrom('Answer')
                    .selectAll()
                    .whereRef('Answer.questionId', '=', 'Question.id')
                    .whereRef('Answer.userId', '=', 'User.id' as any),
            ).as('answer'),
          ]),
      ).as('questions'),
    ])
    .groupBy('Category.id');
}

export const getUserQuestionsByCategory = async (userId: string) => {
  const userQuestionCategories = await chainQuestionsByCategory(db, userId).execute();
  return userQuestionCategories;
};

export const getCandidateAnswerScore = async (user: DefaultSession['user'], candidateId: string) => {
  const currentUser = await getUser(user);

  if (!currentUser) {
    return undefined;
  }

  const userQuestionCategories = await getUserQuestionsByCategory(currentUser.id);

  const candidateQuestionCategories = await getUserQuestionsByCategory(candidateId);

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

export const getCandidates = async () => {
  const candidates: CandidateResult[] = await db
    .selectFrom('User')
    .selectAll('User')
    .select((eb) => [
      jsonObjectFrom(
        eb.selectFrom('CandidateData').selectAll('CandidateData').whereRef('CandidateData.userId', '=', 'User.id'),
      ).as('candidateData'),
      jsonArrayFrom(
        eb
          .selectFrom('Office')
          .selectAll('Office')
          .whereRef('Office.id', 'in', sql`(SELECT "officeId" FROM "CandidateOffice" WHERE "userId" = "User"."id")`),
      ).as('offices'),
      jsonArrayFrom(eb.selectFrom('Answer').selectAll('Answer').whereRef('Answer.userId', '=', 'User.id')).as(
        'answers',
      ),
      jsonArrayFrom(eb.selectFrom('Question').selectAll('Question')).as('questions'),
      jsonArrayFrom(chainQuestionsByCategory(eb)).as('categories'),
    ])
    .whereRef('User.id', 'in', sql`(SELECT "userId" FROM "CandidateOffice")`)
    .orderBy('User.name asc')
    .execute();
  return candidates;
};

export const getLocalities = async () => {
  const localities = await db.selectFrom('Locality').selectAll().execute();
  return localities;
};

export const getPledgedCandidate = async (user: DefaultSession['user']) => {
  const currentUser = await getUser(user);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  const pledgedCandidate = await db
    .selectFrom('User')
    .selectAll()
    .whereRef(
      'id',
      'in',
      db
        .selectFrom('UserPledge')
        .select('candidateId')
        .where('userId', '=', currentUser.id)
        .where('dateDeleted', 'is', null),
    )
    .executeTakeFirst();

  return pledgedCandidate;
};

export const pledgeCandidate = async (user: DefaultSession['user'], candidate: User) => {
  const currentUser = await getUser(user);

  if (!currentUser) {
    throw new Error('Not logged in.');
  }

  await db
    .updateTable('UserPledge')
    .where('UserPledge.userId', '=', currentUser.id)
    .where('UserPledge.dateDeleted', 'is', null)
    .set({
      dateDeleted: new Date(),
    })
    .execute();

  await db
    .insertInto('UserPledge')
    .values({
      userId: currentUser.id,
      candidateId: candidate.id,
    })
    .execute();
};
