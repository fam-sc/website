import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { UserRole } from '@shared/api/user/types';
import { unauthrorized } from '@shared/responses';

export async function authRoute(
  request: Request,
  minRole: UserRole,
  block: (repo: Repository, userId: string) => Promise<Response>
): Promise<Response> {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRole(sessionId);

  if (userWithRole === null || userWithRole.role < minRole) {
    return unauthrorized();
  }

  return await block(repo, userWithRole.id);
}
