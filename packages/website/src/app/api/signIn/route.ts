import { NextRequest, NextResponse } from 'next/server';

import { badRequest, unauthrorized } from '@/api/responses';
import { verifyPassword } from '@/auth/password';
import { newSessionId, setSessionId } from '@/auth/session';
import { SignInDataSchema } from '@/auth/types';
import { Repository } from '@data/repo';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawContent = await request.json();
  const signInResult = SignInDataSchema.safeParse(rawContent);
  if (signInResult.error) {
    console.error(signInResult.error);

    return badRequest();
  }

  const { email, password } = signInResult.data;

  await using repo = await Repository.openConnection();

  const user = await repo.users().getUserByEmail(email);
  if (user === null) {
    return unauthrorized();
  }

  const status = await verifyPassword(user.passwordHash.buffer, password);
  if (!status) {
    return unauthrorized();
  }

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId: user._id });

  const response = new NextResponse();
  setSessionId(response, sessionId);

  return response;
}
