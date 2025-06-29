import { Repository } from '@data/repo';
import { badRequest, unauthrorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { hashPassword, verifyPassword } from '@/api/auth/password';
import { ApiErrorCode } from '@/api/errorCodes';
import { changePasswordPayload } from '@/api/users/payloads';

app.put('/users/password', async (request: Request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  const rawPayload = await request.json();
  const payloadResult = changePasswordPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  const { oldPassword, newPassword } = payloadResult.data;

  const repo = Repository.openConnection();

  const userWithPassword = await repo.sessions().getUserWithPassword(sessionId);

  if (userWithPassword === null) {
    return unauthrorized();
  }

  const isValidOld = await verifyPassword(
    userWithPassword.passwordHash,
    oldPassword
  );

  if (!isValidOld) {
    return unauthrorized({
      message: 'Old password is invalid',
      code: ApiErrorCode.INVALID_OLD_PASSWORD,
    });
  }

  const newHash = await hashPassword(newPassword);

  await repo.users().updatePassword(userWithPassword.id, newHash);

  return new Response();
});
