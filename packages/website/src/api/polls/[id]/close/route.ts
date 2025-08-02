import { Repository, UserRole } from '@sc-fam/data';
import { notFound } from '@sc-fam/shared';
import { int, middlewareHandler, params } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

app.post(
  '/polls/:id/close',
  middlewareHandler(
    params({ id: int(notFound) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const { changes } = await repo.polls().closePoll(id);

      return changes > 0 ? new Response() : notFound();
    }
  )
);
