import { ok, unauthrorized } from '@shared/responses';
import { UserInfo } from '@/api/users/types';
import { getSessionIdNumber } from '@/api/auth';
import { formPersonName } from '@shared/person';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { getFacultyGroupMapById } from '@/api/groups/utils';
import { app } from '@/api/app';

app.get('/users/approveList', async (request) => {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();
  const userWithRole = await repo.sessions().getUserWithRoleAndGroup(sessionId);

  if (userWithRole === null || userWithRole.role < UserRole.GROUP_HEAD) {
    return unauthrorized();
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
