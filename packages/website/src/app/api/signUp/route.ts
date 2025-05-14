import { Binary, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorCode } from '@/api/errorCodes';
import { badRequest, internalServerError } from '@/api/responses';
import { hashPassword } from '@/auth/password';
import { newSessionId, setSessionId } from '@/auth/session';
import { SignUpDataSchema } from '@/auth/types';
import { Repository } from '@data/repo';
import { isDuplicateKeyError } from '@/utils/errors/mongo';
import { UserRole } from '@data/types/user';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawContent = await request.json();
  const signUpResult = SignUpDataSchema.safeParse(rawContent);
  if (signUpResult.error) {
    console.error(signUpResult.error);
    return badRequest();
  }

  const {
    email,
    firstName,
    lastName,
    parentName,
    academicGroup,
    telnum,
    password,
  } = signUpResult.data;

  const passwordHash = await hashPassword(password);

  await using repo = await Repository.openConnection();
  let userId: ObjectId;

  try {
    const result = await repo.users().insert({
      email,
      firstName,
      lastName,
      parentName,
      academicGroup,
      telnum,
      telegramUserId: null,
      role: UserRole.STUDENT_NON_APPROVED,
      passwordHash: new Binary(passwordHash),
    });

    userId = result.insertedId;
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return badRequest({
        message: 'Email exists',
        code: ApiErrorCode.EMAIL_EXISTS,
      });
    }

    console.error(error);
    return internalServerError();
  }

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId });

  // TODO: Make redirect to profile page.
  const response = new NextResponse(undefined, { status: 200 });
  setSessionId(response, sessionId);

  return response;
}
