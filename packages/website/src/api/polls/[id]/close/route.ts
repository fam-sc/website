import { UserRole } from '@sc-fam/data';
import { notFound, parseInt } from '@sc-fam/shared';

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
