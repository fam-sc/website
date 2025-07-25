import { Repository } from '@sc-fam/data';
import { badRequest, unauthorized } from '@sc-fam/shared';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { hashPassword, verifyPassword } from '@/api/auth/password';
import { ApiErrorCode } from '@/api/errorCodes';
import { changePasswordPayload } from '@/api/users/payloads';

app.put('/users/password', async (request: Request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
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
    return unauthorized();
  }

  const isValidOld = await verifyPassword(
    userWithPassword.passwordHash,
    oldPassword
  );

  if (!isValidOld) {
    return unauthorized({
      message: 'Old password is invalid',
      code: ApiErrorCode.INVALID_OLD_PASSWORD,
    });
  }

  const newHash = await hashPassword(newPassword);

  await repo.users().updatePassword(userWithPassword.id, newHash);

  return new Response();
});
