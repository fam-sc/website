import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from '@shared/crypto/random';

export const SESSION_ID_COOKIE = 'sid';

export async function newSessionId(): Promise<bigint> {
  const buffer = await randomBytes(8);

  return buffer.readBigInt64LE(0);
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
