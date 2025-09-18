import { Repository } from '@sc-fam/data';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

import { updateScheduleBotOptionsPayload } from './schema';

app.put(
  '/users/schedule',
  middlewareHandler(
    zodSchema(updateScheduleBotOptionsPayload),
    auth(),
    async ({ data: [payload, { id: userId }] }) => {
      const repo = Repository.openConnection();

      await repo.scheduleBotUsers().updateOptionsByUserId(userId, payload);

      return new Response();
    }
  )
);
