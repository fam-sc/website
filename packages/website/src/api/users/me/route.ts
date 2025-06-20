import { app } from '@/api/app';
import { Repository } from '@data/repo';
import { getSessionIdNumber } from '@/api/auth';
import { UserSelfInfo } from '@/api/users/types';
import { ok, unauthrorized } from '@shared/responses';

app.get('/users/me', async (request) => {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();
  const result = await repo.sessions().getUserWithRole(sessionId);
  if (result === null) {
    return unauthrorized();
  }

  const response: UserSelfInfo = {
    id: result.id,
    role: result.role,
    hasAvatar: result.hasAvatar ?? false,
  };

  return ok(response);
});
