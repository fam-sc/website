import { authRoute } from '@/api/authRoute';
import { notFound } from '@shared/responses';
import { UserRole } from '@data/types/user';
import { app } from '@/api/app';

app.post('/polls/:id/close', async (request, { params: { id } }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const { matchedCount } = await repo.polls().closePoll(id);

    return matchedCount === 0 ? notFound() : new Response();
  });
});
