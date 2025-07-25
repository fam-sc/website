import { Repository } from '@sc-fam/data';
import { ok, unauthorized } from '@sc-fam/shared';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { UserSelfInfo } from '@/api/users/types';

app.get('/users/me', async (request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const repo = Repository.openConnection();
  const result = await repo.sessions().getUserWithRole(sessionId);
  if (result === null) {
    return unauthorized();
  }

  const response: UserSelfInfo = {
    id: result.id,
    role: result.role,
    hasAvatar: result.hasAvatar ?? false,
  };

  return ok(response);
});
