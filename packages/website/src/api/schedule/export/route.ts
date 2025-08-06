import { normalizeGuid } from '@sc-fam/shared';
import { string } from '@sc-fam/shared/minivalidate';
import {
  middlewareHandler,
  searchParams,
  zodSchema,
} from '@sc-fam/shared/router';

import { app } from '@/api/app';

import { accessToken } from './accessToken';
import { exportScheduleToGoogleCalendar } from './handler';
import { exportSchedulePayload } from './payloads';

app.post(
  '/schedule/export',
  middlewareHandler(
    accessToken(),
    searchParams({
      groupId: string(),
    }),
    zodSchema(exportSchedulePayload),
    async ({ data: [access, { groupId }, payload] }) => {
      await exportScheduleToGoogleCalendar(
        access,
        normalizeGuid(groupId),
        payload
      );

      return new Response();
    }
  )
);
