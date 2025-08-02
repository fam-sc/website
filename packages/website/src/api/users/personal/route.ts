import { Repository } from '@sc-fam/data';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';
import { userPersonalInfo } from '@/api/users/payloads';

app.put(
  '/users/personal',
  middlewareHandler(
    zodSchema(userPersonalInfo),
    auth(),
    async ({ data: [personalInfo, { id: userId }] }) => {
      const repo = Repository.openConnection();

      await repo.users().updatePersonalInfo(userId, personalInfo);

      return new Response();
    }
  )
);
