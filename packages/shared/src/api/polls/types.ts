import { z } from 'zod';

const title = z.string().min(1);

const options = z.array(
  z.object({
    title: z.string().min(1),
  })
);

export const question = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), title }),
  z.object({ type: z.literal('radio'), title, options }),
  z.object({ type: z.literal('multicheckbox'), title, options }),
  z.object({ type: z.literal('checkbox'), title, requiredTrue: z.boolean() }),
]);

export const answer = z.object({
  text: z.string().min(1).optional(),
  status: z.boolean().optional(),
  selectedIndex: z.number().int().optional(),
  selectedIndices: z.array(z.number().int()).optional(),
});

export const poll = z.object({
  title: z.string().min(1),
  questions: z.array(question).min(1),
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
