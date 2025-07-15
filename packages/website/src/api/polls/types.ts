import { z } from 'zod/v4-mini';

const title = z.string().check(z.minLength(1));

const options = z.array(z.object({ title }));

export const question = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), title }),
  z.object({ type: z.literal('radio'), title, options }),
  z.object({ type: z.literal('multicheckbox'), title, options }),
  z.object({ type: z.literal('checkbox'), title, requiredTrue: z.boolean() }),
]);

const index = z.number().check(z.int());

export const answer = z.object({
  text: z.optional(z.string().check(z.minLength(1))),
  status: z.optional(z.boolean()),
  selectedIndex: z.optional(index),
  selectedIndices: z.optional(z.array(index)),
});

export const poll = z.object({
  title: z.string().check(z.minLength(1)),
  questions: z.array(question).check(z.minLength(1)),
});

export const addPollPayload = poll;

export const submitPollPayload = z.object({
  answers: z.array(answer),
});

export type PollQuestion = z.infer<typeof question>;
export type Poll = z.infer<typeof poll>;
export type AddPollPayload = z.infer<typeof addPollPayload>;
export type SubmitPollPayload = z.infer<typeof submitPollPayload>;

export type PollResultsTable = {
  questions: string[];
  data: string[][];
};
