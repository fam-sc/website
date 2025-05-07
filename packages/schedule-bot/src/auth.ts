import { verifyHmac } from './crypto';

export type TelegramAuthData = {
  userId: string;
  username: string;
  firstName: string;
  authDate: string;
  hash: string;
};

export async function verifyAuthorizationHash(
  data: TelegramAuthData,
  botKey: string
): Promise<boolean> {
  const hashData = `auth_date=${data.authDate}\nfirst_name=${data.firstName}\nid=${data.userId}\nusername=${data.username}`;

  return verifyHmac(botKey, hashData, data.hash);
}
