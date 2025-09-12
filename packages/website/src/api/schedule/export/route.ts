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
      group: string(),
    }),
    zodSchema(exportSchedulePayload),
    async ({ data: [access, { group: groupName }, payload] }) => {
      await exportScheduleToGoogleCalendar(access, groupName, payload);

      return new Response();
    }
  )
);
