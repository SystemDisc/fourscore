import { Simplify } from 'kysely';
import { Answer, CandidateUserScore, Category, Office, Question, User } from './db/database';

export type NotificationType = 'error' | 'success';
export type Notification = {
  type: NotificationType;
  message: string;
  uuid?: string;
};

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type UserWithAnswers = Simplify<User> & {
  answers: Nullable<Simplify<Answer>>[];
  questionsAnswered: number;
  questionsTotal: number;
};

export type CandidateResult = Simplify<User> & {
  answers: Nullable<Simplify<Answer>>[];
  offices: Nullable<Simplify<Office>>[];
  candidateUserScore: Nullable<Simplify<CandidateUserScore>> | null;
  score: number;
};

export type QuestionWithAnswer = Simplify<Question> & {
  answer: Nullable<Simplify<Answer>>;
};

export type CategoryWithQuestionsAndScore = Simplify<Category> & {
  questions: Nullable<QuestionWithAnswer>[];
  similarityScore: number;
};
