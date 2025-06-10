import { badRequest, conflict } from '@shared/responses';
import { Repository } from '@data/repo';
import { Binary, ObjectId } from 'mongodb';
import { parseHexString } from '@shared/string/hex';
import { newSessionId, setSessionId } from '@shared/api/auth';
import { isDuplicateKeyError } from '@shared/errors/mongo';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/api/app';

app.post('/signUp/finish', async (request) => {
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

    const response = new Response();
    setSessionId(response, sessionId);

    return response;
  });
});
