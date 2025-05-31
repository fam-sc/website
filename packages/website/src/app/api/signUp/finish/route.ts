import { badRequest, conflict } from '@/api/responses';
import { Repository } from '@data/repo';
import { Binary, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { parseHexString } from '@shared/hex';
import { newSessionId, setSessionId } from '@/auth/session';
import { isDuplicateKeyError } from '@/utils/errors/mongo';
import { UserRole } from '@data/types/user';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (token === null) {
    return badRequest({ message: 'No token parameter' });
  }

  let tokenBinary: Binary;
  try {
    tokenBinary = new Binary(parseHexString(token));
  } catch {
    return badRequest({ message: 'Invalid token' });
  }

  await using repo = await Repository.openConnection();

  return await repo.transaction(async (trepo) => {
    const pendingUser = await trepo.pendingUsers().findByToken(tokenBinary);
    if (pendingUser === null) {
      return badRequest({ message: 'Invalid token' });
    }

    let userId: ObjectId;

    try {
      const result = await trepo.users().insert({
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        parentName: pendingUser.parentName,
        academicGroup: pendingUser.academicGroup,
        telnum: pendingUser.telnum,
        telegramUserId: null,
        role: UserRole.STUDENT_NON_APPROVED,
        passwordHash: pendingUser.passwordHash,
      });

      userId = result.insertedId;
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return conflict({ message: 'Email exists' });
      }

      throw error;
    }

    await trepo.pendingUsers().delete(pendingUser._id);

    const sessionId = await newSessionId();

    await trepo.sessions().insert({ sessionId, userId });

    const response = new NextResponse();
    setSessionId(response, sessionId);

    return response;
  });
}
