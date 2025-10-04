import { SignJWT } from 'jose';

import { fetchObject } from '../../fetch';

export type TwoLeggedOptions = {
  key: CryptoKey;
  keyId: string;
  scope: string;
  serviceAccount: string;
};

export async function getTwoLeggedAccessToken({
  key,
  keyId,
  scope,
  serviceAccount,
}: TwoLeggedOptions): Promise<string> {
  const jwt = await new SignJWT({
    iss: serviceAccount,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
  })
    .setIssuedAt()
    .setExpirationTime('60mins')
    .setProtectedHeader({
      alg: 'RS256',
      typ: 'JWT',
      kid: keyId,
    })
    .sign(key);

  const response = await fetchObject<{ access_token: string }>(
    `https://oauth2.googleapis.com/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    {
      method: 'POST',
    }
  );

  return `Bearer ${response.access_token}`;
}
