import { Repository, UserRole } from '@sc-fam/data';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';

import { auth } from '../authRoute';
import { addPollPayload } from './schema';

app.post(
  '/polls',
  middlewareHandler(
    zodSchema(addPollPayload),
    auth({ minRole: UserRole.ADMIN }),
    async ({ data: [payload] }) => {
      const repo = Repository.openConnection();
      await repo.polls().insertPoll({
        startDate: Date.now(),
        endDate: null,
        ...payload,
      });

      return new Response();
    }
  )
);
