import { ApiErrorCode } from '@shared/api/errorCodes';
import { badRequest, unauthrorized } from '@shared/responses';
import { changePasswordPayload } from '@shared/api/user/types';
import { hashPassword, verifyPassword } from '@shared/api/auth/password';
import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { Binary } from 'mongodb';
import { app } from '@/api/app';

app.put('/users/password', async (request: Request) => {
  const sessionId = getSessionIdNumber(request);
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

  await using repo = await Repository.openConnection();

  return await repo.transaction(async (trepo) => {
    const userWithPassword = await trepo
      .sessions()
      .getUserWithPassword(sessionId);

    if (userWithPassword === null) {
      return unauthrorized();
    }

    const isValidOld = await verifyPassword(
      userWithPassword.passwordHash.buffer,
      oldPassword
    );

    if (!isValidOld) {
      return unauthrorized({
        message: 'Old password is invalid',
        code: ApiErrorCode.INVALID_OLD_PASSWORD,
      });
    }

    const newHash = await hashPassword(newPassword);

    await trepo
      .users()
      .updatePassword(userWithPassword.id, new Binary(newHash));

    return new Response();
  });
});
