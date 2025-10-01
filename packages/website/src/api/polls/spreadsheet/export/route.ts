import { UserRole } from '@sc-fam/data';
import { badRequest, internalServerError, notFound } from '@sc-fam/shared';
import { middlewareHandler } from '@sc-fam/shared/router/middleware.js';
import {
  exportPollToSpreadsheet,
  PollExportError,
  PollExportErrorType,
} from '@sc-fam/shared-polls';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { getServiceAccountAuthOptions } from '@/api/googleAuth';

app.post(
  '/polls/spreadsheet/export/:pollId',
  middlewareHandler(
    auth({ minRole: UserRole.ADMIN }),
    async ({ env, params: { pollId: rawPollId } }) => {
      const pollId = Number.parseInt(rawPollId);
      if (Number.isNaN(pollId)) {
        return badRequest({ message: 'Invalid poll id' });
      }

      try {
        const options = await getServiceAccountAuthOptions(
          env,
          'https://www.googleapis.com/auth/spreadsheets'
        );

        await exportPollToSpreadsheet(pollId, options);

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
