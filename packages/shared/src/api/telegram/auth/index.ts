import { hash, verifyHmac } from '../../../crypto';
import { parseHexString } from '../../../string/hex';
import { TelegramBotAuthPayload } from './types.js';

function createCheckString(data: TelegramBotAuthPayload): string {
  const parts = [
    ['auth_date', data.auth_date],
    ['first_name', data.first_name],
    ['id', data.id],
    ['last_name', data.last_name],
    ['photo_url', data.photo_url],
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
