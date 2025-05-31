import { Binary, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import { badRequest, conflict, internalServerError } from '@/api/responses';
import { hashPassword } from '@/auth/password';
import { newSessionId, setSessionId } from '@/auth/session';
import { SignUpDataSchema } from '@/auth/types';
import { Repository } from '@data/repo';
import { isDuplicateKeyError } from '@/utils/errors/mongo';
import { randomBytes } from '@shared/crypto/random';
import { sendConfirmationMail } from '@/api/mail/confirmation';
import { checkFacultyGroupExists } from '@/api/groups/get';

function newPendingToken(): Promise<Buffer> {
  return randomBytes(32);
}

function createConfirmationLink(token: Buffer): string {
  const tokenString = token.toString('hex');

  return `https://sc-fam.org/u/finish-sign-up?token=${tokenString}`;
}

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

  const pendingToken = await newPendingToken();

  await using repo = await Repository.openConnection();
  let userId: ObjectId;

  const groupExists = await checkFacultyGroupExists(academicGroup);
  if (!groupExists) {
    return badRequest({ message: 'Unknown academic group' });
  }

  try {
    const result = await repo.pendingUsers().insert({
      email,
      firstName,
      lastName,
      parentName,
      academicGroup,
      telnum,
      createdAt: new Date(),
      passwordHash: new Binary(passwordHash),
      token: new Binary(pendingToken),
    });

    userId = result.insertedId;
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return conflict({ message: 'Email exists' });
    }

    console.error(error);
    return internalServerError();
  }

  await sendConfirmationMail(email, createConfirmationLink(pendingToken));

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId });

  const response = new NextResponse(undefined, { status: 200 });
  setSessionId(response, sessionId);

  return response;
}
