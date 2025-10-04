import { UserRole } from '@sc-fam/data';
import { badRequest, internalServerError, notFound } from '@sc-fam/shared';
import { scope } from '@sc-fam/shared/api/google';
import { middlewareHandler } from '@sc-fam/shared/router/middleware.js';
import {
  exportPollToSpreadsheetWithAuth,
  PollExportError,
  PollExportErrorType,
} from '@sc-fam/shared-polls';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { getServiceAccountAuthOptions } from '@/api/googleAuth';

import { pollId } from '../middleware';

app.post(
  '/polls/:id/spreadsheet/export',
  middlewareHandler(
    pollId(),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env, data: [pollId] }) => {
      try {
        const options = await getServiceAccountAuthOptions(
          env,
          scope('spreadsheets')
        );

        await exportPollToSpreadsheetWithAuth(pollId, options);

        return new Response();
      } catch (error) {
        console.error(error);

        if (error instanceof PollExportError) {
          return error.type === PollExportErrorType.NOT_FOUND
            ? notFound()
            : badRequest({ message: 'No linked spreadsheet' });
        }

        return internalServerError();
      }
    }
  )
);
