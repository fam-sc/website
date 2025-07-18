import { Repository } from '@data/repo';
import { badRequest } from '@shared/responses';

import { app } from '@/api/app';
import { hashPassword } from '@/api/auth/password';
import { ApiErrorCode } from '@/api/errorCodes';

import { resetPasswordPayload } from './schema';

app.post('/users/resetPassword', async (request) => {
  const rawPayload = await request.json();
  const payloadResult = resetPasswordPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const { token, newPassword } = payloadResult.data;

  const repo = Repository.openConnection();
  const newHash = await hashPassword(newPassword);
  const now = Date.now();

  const [updateResult] = await repo.batch([
    repo.forgotPasswordEntries().updatePasswordByToken(token, newHash, now),
    repo.forgotPasswordEntries().deleteByToken(token),
  ]);

  if (updateResult.changes === 0) {
    return badRequest({
      message: 'Token expired',
      code: ApiErrorCode.TOKEN_EXPIRED,
    });
  }

  return new Response();
});
