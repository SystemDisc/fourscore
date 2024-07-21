import { GeneratedAlways, Insertable, Kysely, PostgresDialect, Selectable, Updateable } from 'kysely';
import { Pool } from 'pg';

interface Database {
  User: UserTable;
  Account: AccountTable;
  Session: SessionTable;
  VerificationToken: VerificationTokenTable;
  Address: AddressTable;
  Question: QuestionTable;
  Locality: LocalityTable;
  Category: CategoryTable;
  Answer: AnswerTable;
  Office: OfficeTable;
  CandidateOffice: CandidateOfficeTable;
  CandidateUserScore: CandidateUserScoreTable;
}

export interface UserTable {
  id: GeneratedAlways<string>;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  seenVotingTutorial: boolean;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface AccountTable {
  id: GeneratedAlways<string>;
  userId: string;
  type: 'oidc' | 'oauth' | 'email' | 'webauthn';
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: 'bearer' | 'dpop' | Lowercase<string>;
  scope?: string;
  id_token?: string;
  session_state: string | null;
}

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export interface SessionTable {
  id: GeneratedAlways<string>;
  userId: string;
  sessionToken: string;
  expires: Date;
}

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;

export interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires: Date;
}

export type VerificationToken = Selectable<VerificationTokenTable>;
export type NewVerificationToken = Insertable<VerificationTokenTable>;
export type VerificationTokenUpdate = Updateable<VerificationTokenTable>;

export interface AddressTable {
  id: GeneratedAlways<string>;
  userId: string;
  streetNumber: string | null;
  route: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export type Address = Selectable<AddressTable>;
export type NewAddress = Insertable<AddressTable>;
export type AddressUpdate = Updateable<AddressTable>;

export interface QuestionTable {
  id: GeneratedAlways<string>;
  localityId: string;
  categoryId: string;
  question: string;
}

export type Question = Selectable<QuestionTable>;
export type NewQuestion = Insertable<QuestionTable>;
export type QuestionUpdate = Updateable<QuestionTable>;

export interface LocalityTable {
  id: GeneratedAlways<string>;
  name: string;
  position: number | null;
}

export type Locality = Selectable<LocalityTable>;
export type NewLocality = Insertable<LocalityTable>;
export type LocalityUpdate = Updateable<LocalityTable>;

export interface CategoryTable {
  id: GeneratedAlways<string>;
  name: string;
}

export type Category = Selectable<CategoryTable>;
export type NewCategory = Insertable<CategoryTable>;
export type CategoryUpdate = Updateable<CategoryTable>;

export interface AnswerTable {
  id: GeneratedAlways<string>;
  userId: string;
  questionId: string;
  agree: boolean | null;
  rating: number | null;
  skipped: boolean;
  notes: string | null;
  dateUpdated: Date;
}

export type Answer = Selectable<AnswerTable>;
export type NewAnswer = Insertable<AnswerTable>;
export type AnswerUpdate = Updateable<AnswerTable>;

export interface OfficeTable {
  id: GeneratedAlways<string>;
  localityId: string;
  location: string;
  name: string;
}

export type Office = Selectable<OfficeTable>;
export type NewOffice = Insertable<OfficeTable>;
export type OfficeUpdate = Updateable<OfficeTable>;

export interface CandidateOfficeTable {
  id: GeneratedAlways<string>;
  userId: string;
  officeId: string;
}

export type CandidateOffice = Selectable<CandidateOfficeTable>;
export type NewCandidateOffice = Insertable<CandidateOfficeTable>;
export type CandidateOfficeUpdate = Updateable<CandidateOfficeTable>;

export interface CandidateUserScoreTable {
  id: GeneratedAlways<string>;
  userId: string;
  candidateId: string;
  score: number;
  dateUpdated: Date;
}

export type CandidateUserScore = Selectable<CandidateUserScoreTable>;
export type NewCandidateUserScore = Insertable<CandidateUserScoreTable>;
export type CandidateUserScoreUpdate = Updateable<CandidateUserScoreTable>;

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
