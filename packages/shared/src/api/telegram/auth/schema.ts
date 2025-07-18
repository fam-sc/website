import { number, object, optional, string } from 'zod/v4-mini';

export const telegramBotAuthPayload = object({
  id: number(),
  username: string(),
  first_name: string(),
  auth_date: number(),
  hash: string(),
  last_name: optional(string()),
  photo_url: optional(string()),
});
