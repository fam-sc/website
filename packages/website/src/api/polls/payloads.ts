import { z } from 'zod';

export const addPollPayload = z.object({
  title: z.string().min(1),
  questions: z.array(
    z.object({
      type: z.enum(['text', 'checkbox', 'radio']),
      title: z.string().min(1),
      options: z
        .array(
          z.object({
            title: z.string().min(1),
          })
        )
        .optional(),
    })
  ),
});

export type AddPollPayload = z.infer<typeof addPollPayload>;
