import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { formPersonName } from '@shared/person';
import { ok, unauthorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { getFacultyGroupMapById } from '@/api/groups/utils';
import { UserInfo } from '@/api/users/types';

app.get('/users/approveList', async (request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const repo = Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRoleAndGroup(sessionId);

  if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
    return unauthorized();
  }

  const { role, academicGroup } = userWithRole;

  const users = await repo
    .users()
    .findAllNonApprovedUsers(
      role === UserRole.ADMIN ? undefined : academicGroup
    );

  const groups = await getFacultyGroupMapById(
    users.map(({ academicGroup }) => academicGroup)
  );

  const result: UserInfo[] = users.map((item) => ({
    id: item.id,
    name: formPersonName(item.firstName, item.lastName, item.parentName),
    email: item.email,
    group: groups.get(item.academicGroup) ?? '',
    hasAvatar: item.hasAvatar ?? false,
  }));

  return ok(result);
});
