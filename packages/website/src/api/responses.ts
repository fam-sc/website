import { NextResponse } from 'next/server';

import { ApiErrorCode } from '@/api/errorCodes';

function helper(message: string, status: number): () => NextResponse {
  return () => new NextResponse(message, { status });
}

export const notFound = helper('Not Found', 404);
export const unauthrorized = helper('Unauthorized', 401);

export function badRequest(explanation?: {
  message: string;
  code?: ApiErrorCode;
}): NextResponse {
  return new NextResponse(
    explanation ? JSON.stringify(explanation) : undefined,
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
