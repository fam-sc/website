import { authRoute } from '@/authRoute';
import { notFound } from '@shared/responses';
import { UserRole } from '@shared/api/user/types';
import { app } from '@/app';

app.post('/polls/:id/close', async (request, { params: { id } }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const { matchedCount } = await repo.polls().closePoll(id);

    return matchedCount === 0 ? notFound() : new Response();
  });
});
