import { Repository, UserRole } from '@sc-fam/data';
import { unauthorized } from '@sc-fam/shared';

import { getSessionId } from '@/api/auth';

export async function authRoute(
  request: Request,
  minRole: UserRole,
  block: (repo: Repository, userId: number) => Promise<Response>
): Promise<Response> {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const repo = Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRole(sessionId);

  if (userWithRole === null || userWithRole.role < minRole) {
    return unauthorized();
  }

  return await block(repo, userWithRole.id);
}
