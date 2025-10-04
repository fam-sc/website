import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, ok } from '@sc-fam/shared';
import { getTwoLeggedAccessToken, scope } from '@sc-fam/shared/api/google';
import { getSpreadsheet } from '@sc-fam/shared/api/google/spreadsheets';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';
import { exportPollToSpreadsheet } from '@sc-fam/shared-polls';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { getServiceAccountAuthOptions } from '@/api/googleAuth';

import { pollId } from './middleware';
import { setPollSpreadsheetPayload } from './payload';
import { PollSpreadsheetInfo } from './types';

function getAuthOptions(env: Env) {
  return getServiceAccountAuthOptions(env, scope('spreadsheets'));
}

async function getAccess(env: Env) {
  const options = await getAuthOptions(env);

  return getTwoLeggedAccessToken(options);
}

async function getSpreadsheetById(env: Env, spreadsheetId: string) {
  const access = await getAccess(env);

  return getSpreadsheet(access, { spreadsheetId, includeGridData: false });
}

async function canAccessSpreadsheet(access: string, spreadsheetId: string) {
  try {
    await getSpreadsheet(access, { spreadsheetId, includeGridData: false });

    return true;
  } catch {
    return false;
  }
}

app.get(
  '/polls/:id/spreadsheet',
  middlewareHandler(
    pollId(),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env, data: [pollId] }) => {
      const repo = Repository.openConnection();
      const spreadsheetId = await repo.polls().getSpreadsheet(pollId);
      if (spreadsheetId === null) {
        return ok(null);
      }

      const spreadsheet = await getSpreadsheetById(env, spreadsheetId);

      return ok<PollSpreadsheetInfo | null>({
        name: spreadsheet.properties.title,
        link: spreadsheet.spreadsheetUrl,
      });
    }
  )
);

app.put(
  '/polls/:id/spreadsheet',
  middlewareHandler(
    pollId(),
    zodSchema(setPollSpreadsheetPayload),
    auth({ minRole: UserRole.ADMIN }),
    async ({ env, data: [pollId, { spreadsheetId }] }) => {
      const access = await getAccess(env);

      if (!(await canAccessSpreadsheet(access, spreadsheetId))) {
        return badRequest({ message: 'Invalid spreadsheetId' });
      }

      const repo = Repository.openConnection();

      await repo.polls().setSpreadsheet(pollId, spreadsheetId);

      await exportPollToSpreadsheet(pollId, access);

      return new Response();
    }
  )
);
