import { authRoute } from '@/api/authRoute';
import { getFacultyGroupMapById } from '@/api/groups/utils';
import { badRequest, ok } from '@shared/responses';
import { parseInt } from '@shared/parseInt';
import { formPersonName } from '@shared/person';
import { UserInfoWithRole } from '@/api/users/types';
import { app } from '@/api/app';
import { UserRole } from '@data/types/user';

const PAGE_SIZE = 20;

app.get('/users', async (request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page'));
  if (page === undefined) {
    return badRequest({ message: 'Invalid page parameter' });
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const users = await repo.users().getPage(page - 1, PAGE_SIZE);

    const groups = await getFacultyGroupMapById(
      users.map(({ academicGroup }) => academicGroup)
    );

    const responseResult: UserInfoWithRole[] = users.map((item) => ({
      id: item.id,
      name: formPersonName(item.firstName, item.lastName, item.parentName),
      email: item.email,
      group: groups.get(item.academicGroup) ?? '',
      role: item.role,
      hasAvatar: item.hasAvatar,
    }));

    return ok(responseResult);
  });
});
