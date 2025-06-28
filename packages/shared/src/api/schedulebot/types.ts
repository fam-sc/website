import { number, object, optional, string, z } from 'zod/v4-mini';

export const scheduleBotAuthPayload = object({
  telegramUserId: number(),
  username: string(),
  firstName: string(),
  authDate: number(),
  photoUrl: optional(string()),
  hash: string(),
});

export type ScheduleBotAuthPayload = z.infer<typeof scheduleBotAuthPayload>;
