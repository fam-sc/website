import { randomBytes } from '../../crypto/random';
import { getCookieValue, setCookie } from '../cookies';

export const SESSION_ID_COOKIE = 'sid';

export async function newSessionId(): Promise<bigint> {
  const buffer = await randomBytes(8);

  return buffer.readBigInt64LE(0);
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

export function setSessionId(response: Response, value: bigint) {
  setCookie(response, {
    name: SESSION_ID_COOKIE,
    value: value.toString(10),
    httpOnly: true,
    path: '/',
    domain: 'sc-fam.org',
  });
}
