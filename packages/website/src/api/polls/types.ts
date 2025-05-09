import { z } from 'zod';

export const question = z.object({
  type: z.enum(['text', 'checkbox', 'multicheckbox', 'radio']),
  title: z.string().min(1),
  requiredTrue: z.boolean().optional(),
  options: z
    .array(
      z.object({
        title: z.string().min(1),
      })
    )
    .optional(),
});

export const answer = z.object({
  text: z.string().min(1).optional(),
  status: z.boolean().optional(),
  selectedIndex: z.number().optional(),
  selectedIndices: z.array(z.number()).optional(),
});

export const poll = z.object({
  title: z.string().min(1),
  questions: z.array(question),
});

export const addPollPayload = poll;

export const submitPollPayload = z.object({
  answers: z.array(answer),
});

export type Question = z.infer<typeof question>;
export type Poll = z.infer<typeof poll>;
export type AddPollPayload = z.infer<typeof addPollPayload>;
export type SubmitPollPayload = z.infer<typeof submitPollPayload>;
