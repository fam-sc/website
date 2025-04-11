import { NextResponse } from 'next/server';

function helper(message: string, status: number): () => NextResponse {
  return () => new NextResponse(message, { status });
}

export const notFound = helper('Not Found', 404);

export function badRequest(explanation?: string): NextResponse {
  return new NextResponse(
    `Bad request${explanation ? `: ${explanation}` : ''}`,
    { status: 400 }
  );
}
