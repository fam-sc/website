import { randomBytes } from '@shared/crypto/random';
import { getCookieValue, setCookie } from '@shared/cookies';

export const SESSION_ID_COOKIE = 'sid';

export async function newSessionId(): Promise<string> {
  const buffer = await randomBytes(8);

  return buffer.toString('hex');
}

export function getSessionId(request: Request): string | undefined {
  return getCookieValue(request, SESSION_ID_COOKIE);
}

export function getSessionIdNumber(request: Request): bigint | undefined {
  return parseSessionIdString(getSessionId(request));
}

export function parseSessionIdString(
  value: string | undefined
): bigint | undefined {
  return value === undefined ? undefined : BigInt(value);
}

export function setSessionId(response: Response, value: string) {
  setCookie(response, {
    name: SESSION_ID_COOKIE,
    value,
    httpOnly: true,
    path: '/',
    domain: 'sc-fam.org',
  });
}
