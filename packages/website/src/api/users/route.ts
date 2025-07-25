import { UserRole } from '@sc-fam/data';
import { badRequest, formPersonName, ok, parseInt } from '@sc-fam/shared';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { UserInfoWithRole } from '@/api/users/types';

const PAGE_SIZE = 20;

app.get('/users', async (request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page'));
  if (page === undefined) {
    return badRequest({ message: 'Invalid page parameter' });
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const users = await repo.users().getPage(page - 1, PAGE_SIZE);

    const responseResult: UserInfoWithRole[] = users.map((item) => ({
      id: item.id,
      name: formPersonName(item.firstName, item.lastName, item.parentName),
      email: item.email,
      group: item.academicGroup,
      role: item.role,
      hasAvatar: item.hasAvatar,
    }));

    return ok(responseResult);
  });
});
