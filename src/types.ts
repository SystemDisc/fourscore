import { Simplify } from 'kysely';
import { Answer, CandidateUserScore, Office, User } from './db/database';

export type NotificationType = 'error' | 'success';
export type Notification = { type: NotificationType, message: string, uuid?: string };

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type CandidateResult = Simplify<User> & {
  answers: Nullable<Simplify<Answer>>[];
  offices: Nullable<Simplify<Office>>[];
  candidateUserScore: Nullable<Simplify<CandidateUserScore>> | null;
  score: number;
};
