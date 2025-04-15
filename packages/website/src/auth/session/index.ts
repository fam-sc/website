import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';

export const SESSION_ID_COOKIE = 'sid';

export function newSessionId(): Promise<bigint> {
  return new Promise((resolve, reject) => {
    randomBytes(8, (error, buffer) => {
      if (error === null) {
        resolve(buffer.readBigInt64LE(0));
      } else {
        reject(error);
      }
    });
  });
}

export function getSessionId(request: NextRequest): string | undefined {
  const cookie = request.cookies.get(SESSION_ID_COOKIE);

  return cookie?.value;
}

export function getSessionIdNumber(request: NextRequest): bigint | undefined {
  return parseSessionIdString(getSessionId(request));
}

export function parseSessionIdString(
  value: string | undefined
): bigint | undefined {
  return value === undefined ? undefined : BigInt(value);
}

export function setSessionId(response: NextResponse, value: bigint) {
  response.cookies.set(SESSION_ID_COOKIE, value.toString(10));
}
