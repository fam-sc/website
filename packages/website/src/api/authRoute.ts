import { Repository, UserRole, UserWithRoleAndAvatar } from '@sc-fam/data';
import { unauthorized } from '@sc-fam/shared';
import { Middleware, RequestArgs } from '@sc-fam/shared/router';

import { getSessionId } from '@/api/auth';

type Getter<T> = (repo: Repository, sessionId: string) => Promise<T | null>;

export function auth<Opts, T extends { id: number; role: UserRole }>(options?: {
  minRole: UserRole;
  get: Getter<T>;
}): Middleware<T, Opts>;

export function auth<Opts>(options?: {
  minRole?: UserRole;
}): Middleware<UserWithRoleAndAvatar, Opts>;

export function auth<Opts, T>(options: { get: Getter<T> }): Middleware<T, Opts>;

export function auth<
  Args extends RequestArgs,
  T extends { id?: number; role?: UserRole },
>(options?: {
  minRole?: UserRole;
  get?: Getter<T>;
}): Middleware<T | UserWithRoleAndAvatar, Args> {
  const get = options?.get;
  const minRole = options?.minRole;

  return async ({ request }) => {
    const sessionId = getSessionId(request);
    if (sessionId === undefined) {
      return unauthorized();
    }

    const repo = Repository.openConnection();
    const userWithRole = await (get
      ? get(repo, sessionId)
      : repo.sessions().getUserWithRole(sessionId));

    if (userWithRole === null) {
      return unauthorized();
    }

    const userRole = userWithRole.role;
    if (userRole !== undefined && minRole !== undefined && userRole < minRole) {
      return unauthorized();
    }

    return userWithRole;
  };
}

export function userWithRoleGetter(repo: Repository, sessionId: string) {
  return repo.sessions().getUserWithRoleAndGroup(sessionId);
}
