import { badRequest, normalizeGuid } from '@sc-fam/shared';
import { string } from '@sc-fam/shared/minivalidate';
import {
  middlewareHandler,
  searchParams,
  zodSchema,
} from '@sc-fam/shared/router';

import { app } from '@/api/app';

import { exportScheduleToGoogleCalendar } from './handler';
import { exportSchedulePayload } from './payloads';

app.post(
  '/schedule/export',
  middlewareHandler(
    searchParams({
      groupId: string(),
    }),
    zodSchema(exportSchedulePayload),
    async ({ request, data: [{ groupId }, payload] }) => {
      const accessToken = request.headers.get('X-Access-Token');
      if (accessToken === null) {
        return badRequest({ message: 'No access token' });
      }

      await exportScheduleToGoogleCalendar(
        accessToken,
        normalizeGuid(groupId),
        payload
      );

      return new Response();
    }
  )
);
