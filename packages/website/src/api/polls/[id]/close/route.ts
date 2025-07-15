import { UserRole } from '@data/types/user';
import { parseInt } from '@shared/parseInt';
import { notFound } from '@shared/responses';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';

app.post('/polls/:id/close', async (request, { params }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const numberId = parseInt(params.id);
    if (numberId !== undefined) {
      const { changes } = await repo.polls().closePoll(numberId);

      if (changes !== 0) {
        return new Response();
      }
    }

    return notFound();
  });
});
