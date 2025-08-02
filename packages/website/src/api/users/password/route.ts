import { Repository } from '@sc-fam/data';
import { unauthorized } from '@sc-fam/shared';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { hashPassword, verifyPassword } from '@/api/auth/password';
import { auth } from '@/api/authRoute';
import { ApiErrorCode } from '@/api/errorCodes';
import { changePasswordPayload } from '@/api/users/payloads';

app.put(
  '/users/password',
  middlewareHandler(
    zodSchema(changePasswordPayload),
    auth({
      get: (repo, sessionId) => repo.sessions().getUserWithPassword(sessionId),
    }),
    async ({ data: [payload, { id, passwordHash }] }) => {
      const { oldPassword, newPassword } = payload;
      const isValidOld = await verifyPassword(passwordHash, oldPassword);

      if (!isValidOld) {
        return unauthorized({
          message: 'Old password is invalid',
          code: ApiErrorCode.INVALID_OLD_PASSWORD,
        });
      }

      const newHash = await hashPassword(newPassword);

      const repo = Repository.openConnection();
      await repo.users().updatePassword(id, newHash);

      return new Response();
    }
  )
);
