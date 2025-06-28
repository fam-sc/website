import { getSessionId } from '@/api/auth';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { unauthrorized } from '@shared/responses';

export async function authRoute(
  request: Request,
  minRole: UserRole,
  block: (repo: Repository, userId: number) => Promise<Response>
): Promise<Response> {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  const repo = Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRole(sessionId);

  if (userWithRole === null || userWithRole.role < minRole) {
    return unauthrorized();
  }

  return await block(repo, userWithRole.id);
}
