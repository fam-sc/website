import { authRoute } from '@/api/authRoute';
import { badRequest, ok } from '@/api/responses';
import { checkUsersHaveAvatar } from '@/api/user/avatar';
import { UserInfoWithRole } from '@/api/user/types';
import { parseInt } from '@/utils/parseInt';
import { formPersonName } from '@/utils/person';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page'));
  if (page === undefined) {
    return badRequest({ message: 'Invalid page parameter' });
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const users = await repo.users().getPage(page - 1, PAGE_SIZE);
    const usersHaveAvatar = await checkUsersHaveAvatar(users);

    const responseResult: UserInfoWithRole[] = users.map((item, i) => ({
      id: item.id,
      name: formPersonName(item.firstName, item.lastName, item.parentName),
      email: item.email,
      group: item.academicGroup,
      role: item.role,
      hasAvatar: usersHaveAvatar[i],
    }));

    return ok(responseResult);
  });
}
