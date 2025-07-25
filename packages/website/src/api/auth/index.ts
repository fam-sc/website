import { getCookieValue, setCookie } from '@sc-fam/shared';
import { randomBytes } from '@sc-fam/shared/crypto';

export const SESSION_ID_COOKIE = 'sid';

export async function newSessionId(): Promise<string> {
  const buffer = await randomBytes(8);

  return buffer.toString('hex');
}

export function getSessionId(request: Request): string | undefined {
  return getCookieValue(request, SESSION_ID_COOKIE);
}

export function setSessionId(response: Response, value: string) {
  setCookie(response, {
    name: SESSION_ID_COOKIE,
    value,
    httpOnly: true,
    path: '/',
  });
}
