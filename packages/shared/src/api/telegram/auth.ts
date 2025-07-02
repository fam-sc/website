import { number, object, optional, string, z } from 'zod/v4-mini';

import { hash, verifyHmac } from '../../crypto';
import { parseHexString } from '../../string/hex';

export const telegramBotAuthPayload = object({
  telegramUserId: number(),
  username: string(),
  firstName: string(),
  authDate: number(),
  photoUrl: optional(string()),
  hash: string(),
});

export type TelegramBotAuthPayload = z.infer<typeof telegramBotAuthPayload>;

function createCheckString(data: TelegramBotAuthPayload): string {
  const parts = [
    ['auth_date', data.authDate],
    ['first_name', data.firstName],
    ['id', data.telegramUserId],
    ['photo_url', data.photoUrl],
    ['username', data.username],
  ];

  return parts
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export async function verifyAuthorizationHash(
  payload: TelegramBotAuthPayload,
  botKey: string
): Promise<boolean> {
  const checkString = createCheckString(payload);
  const signed = parseHexString(payload.hash);
  const key = await hash(botKey);

  return verifyHmac(key, checkString, signed);
}
