import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { badRequest, conflict } from '@shared/responses';

import { app } from '@/api/app';
import { onNewUserCreated } from '@/api/appEvents/newUser';
import { newSessionId, setSessionId } from '@/api/auth';

app.post('/signUp/finish', async (request, { env }) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (token === null) {
    return badRequest({ message: 'No token parameter' });
  }

  const repo = Repository.openConnection();

  const pendingUser = await repo.pendingUsers().findByToken(token);
  if (pendingUser === null) {
    return badRequest({ message: 'Invalid token' });
  }

  let userId: number;

  try {
    userId = await repo.users().insert(
      {
        email: pendingUser.email,
        firstName: pendingUser.firstName,
        lastName: pendingUser.lastName,
        parentName: pendingUser.parentName,
        academicGroup: pendingUser.academicGroup,
        telnum: pendingUser.telnum,
        passwordHash: pendingUser.passwordHash,
        role: UserRole.STUDENT_NON_APPROVED,
        scheduleBotUserId: null,
        adminBotUserId: null,
        hasAvatar: 0,
      },
      'id'
    );
  } catch (error: unknown) {
    console.log(error);
    return conflict({ message: 'Email exists' });
  }

  const sessionId = await newSessionId();

  await repo.pendingUsers().deleteWhere({ token }).get();
  await repo.sessions().insert({ sessionId, userId });

  await onNewUserCreated(
    {
      id: userId,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      parentName: pendingUser.parentName,
      academicGroup: pendingUser.academicGroup,
      email: pendingUser.email,
      telnum: pendingUser.telnum,
    },
    env
  );

  const response = new Response();
  setSessionId(response, sessionId);

  return response;
});
