import { infer as zodInfer } from 'zod/v4-mini';

import type {
  addPollPayload,
  poll,
  question,
  submitPollPayload,
} from './schema';

export type PollQuestion = zodInfer<typeof question>;
export type Poll = zodInfer<typeof poll>;
export type AddPollPayload = zodInfer<typeof addPollPayload>;
export type SubmitPollPayload = zodInfer<typeof submitPollPayload>;

export type PollResultsTable = {
  questions: string[];
  data: string[][];
};
