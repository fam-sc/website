import { NextResponse } from 'next/server';

import { ApiErrorCode } from '@/api/errorCodes';

export type ErrorResponseBody = { message: string; code?: ApiErrorCode };

function helper(defaultMessage: string, status: number) {
  return (explanation?: ErrorResponseBody) =>
    new NextResponse(
      JSON.stringify(explanation ?? { message: defaultMessage }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    );
}

export const notFound = helper('Not Found', 404);
export const unauthrorized = helper('Unauthorized', 401);
export const internalServerError = helper('Internal Server Error', 500);
export const badRequest = helper('Bad Request', 400);
export const conflict = helper('Conflict', 409);

export function ok(value: object): NextResponse {
  return new NextResponse(JSON.stringify(value), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
