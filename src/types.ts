import { Simplify } from 'kysely';
import { Answer, CandidateData, CandidateUserScore, Category, Office, Question, User } from './db/database';

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
  answers: Simplify<Answer>[];
  questionsAnswered: number;
  questionsTotal: number;
};

export type CandidateResult = Simplify<User> & {
  candidateData: Simplify<CandidateData> | null;
  answers: Simplify<Answer>[];
  questions: Simplify<Question>[];
  offices: Simplify<Office>[];
  candidateUserScore?: Simplify<CandidateUserScore> | null;
  score?: number;
  categories?: CategoryWithQuestions[];
};

export type QuestionWithAnswer = Simplify<Question> & {
  answer: Simplify<Answer>;
};

export type CategoryWithQuestions = Simplify<Category> & {
  questions: Nullable<QuestionWithAnswer>[];
};

export type CategoryWithQuestionsAndScore = CategoryWithQuestions & {
  similarityScore: number;
};

export interface ParsedUrl {
  pathname: string;
  searchParams: URLSearchParams;
}
