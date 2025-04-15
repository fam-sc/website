import { NextRequest, NextResponse } from 'next/server';

import { badRequest, unauthrorized } from '@/api/responses';
import { verifyPassword } from '@/auth/password';
import { newSessionId, setSessionId } from '@/auth/session';
import { SignInDataSchema } from '@/auth/types';
import { Repository } from '@/data/repo';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawContent = await request.json();
    const { email, password } = SignInDataSchema.parse(rawContent);

    await using repo = await Repository.openConnection();

    const user = await repo.users().getUserByEmail(email);
    if (user === null) {
      return unauthrorized();
    }

    const status = await verifyPassword(user.passwordHash, password);
    if (!status) {
      return unauthrorized();
    }

    const sessionId = await newSessionId();

    await repo.sessions().insert({ sessionId, userId: user._id });

    const response = new NextResponse(undefined, { status: 200 });
    setSessionId(response, sessionId);

    return response;
  } catch (error: unknown) {
    console.error(error);

    return badRequest();
  }
}
