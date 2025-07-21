import { infer as zodInfer } from 'zod/v4-mini';

import { QuestionType } from '@/services/polls/types';

import type {
  addPollPayload,
  poll,
  question,
  submitPollPayload,
} from './schema';

type QuestionSchema = zodInfer<typeof question>;

export type PollQuestion<T extends QuestionType = QuestionType> = {
  [K in T]: Extract<QuestionSchema, { type: T }>;
}[T];

export type Poll = zodInfer<typeof poll>;
export type AddPollPayload = zodInfer<typeof addPollPayload>;
export type SubmitPollPayload = zodInfer<typeof submitPollPayload>;

export type PollResultsTable = {
  questions: string[];
  data: string[][];
};
