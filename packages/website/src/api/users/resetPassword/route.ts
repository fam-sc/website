import { Repository } from '@sc-fam/data';
import { badRequest } from '@sc-fam/shared';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { hashPassword } from '@/api/auth/password';
import { ApiErrorCode } from '@/api/errorCodes';

import { resetPasswordPayload } from './schema';

app.post(
  '/users/resetPassword',
  middlewareHandler(
    zodSchema(resetPasswordPayload),
    async ({ data: [payload] }) => {
      const { token, newPassword } = payload;

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
    }
  )
);
