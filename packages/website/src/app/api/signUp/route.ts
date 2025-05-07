import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorCode } from '@/api/errorCodes';
import { badRequest } from '@/api/responses';
import { hashPassword } from '@/auth/password';
import { newSessionId, setSessionId } from '@/auth/session';
import { SignUpDataSchema } from '@/auth/types';
import { Repository } from '@data/repo';
import { isDuplicateKeyError } from '@/utils/errors/mongo';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawContent = await request.json();
    const {
      email,
      firstName,
      lastName,
      parentName,
      academicGroup,
      telnum,
      password,
    } = SignUpDataSchema.parse(rawContent);

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
        photoId: null,
        role: 'student',
        passwordHash,
      });

      userId = result.insertedId;
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return badRequest({
          message: 'Email exists',
          code: ApiErrorCode.EMAIL_EXISTS,
        });
      }

      // Rethrow for the exception handler below.
      throw error;
    }

    const sessionId = await newSessionId();

    await repo.sessions().insert({ sessionId, userId });

    // TODO: Make redirect to profile page.
    const response = new NextResponse(undefined, { status: 200 });
    setSessionId(response, sessionId);

    return response;
  } catch (error: unknown) {
    console.error(error);

    return badRequest();
  }
}
