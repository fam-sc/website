import { app } from '@/api/app';
import { Repository } from '@data/repo';
import { getSessionId } from '@/api/auth';
import { UserSelfInfo } from '@/api/users/types';
import { ok, unauthrorized } from '@shared/responses';

app.get('/users/me', async (request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  const repo = Repository.openConnection();
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
