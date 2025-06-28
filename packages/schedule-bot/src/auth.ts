import { hash, verifyHmac } from '@shared/crypto';
import { ScheduleBotAuthPayload } from '@shared/api/schedulebot/types';
import { parseHexString } from '@shared/string/hex';

function createCheckString(data: ScheduleBotAuthPayload): string {
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
  payload: ScheduleBotAuthPayload,
  botKey: string
): Promise<boolean> {
  const checkString = createCheckString(payload);
  const signed = parseHexString(payload.hash);
  const key = await hash(botKey);

  return verifyHmac(key, checkString, signed);
}
