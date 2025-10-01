import { Repository, UserRole } from '@sc-fam/data';
import { badRequest } from '@sc-fam/shared';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

import { setPollSpreadsheetPayload } from './payload';

app.put(
  '/polls/spreadsheet/:pollId',
  middlewareHandler(
    zodSchema(setPollSpreadsheetPayload),
    auth({ minRole: UserRole.ADMIN }),
    async ({ params: { pollId: rawPollId }, data: [{ spreadsheetId }] }) => {
      const pollId = Number.parseInt(rawPollId);
      if (Number.isNaN(pollId)) {
        return badRequest({ message: 'Invalid poll id' });
      }

      const repo = Repository.openConnection();

      await repo.polls().setSpreadsheet(pollId, spreadsheetId);

      return new Response();
    }
  )
);
