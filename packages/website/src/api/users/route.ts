import { Repository, UserRole } from '@sc-fam/data';
import { formPersonName, ok } from '@sc-fam/shared';
import { int } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { UserInfoWithRole } from '@/api/users/types';

import { auth } from '../authRoute';

const PAGE_SIZE = 20;

app.get(
  '/users',
  middlewareHandler(
    searchParams({ page: int('Invalid page parameter') }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ data: [{ page }] }) => {
      const repo = Repository.openConnection();
      const users = await repo.users().getPage(page - 1, PAGE_SIZE);

      return ok(
        users.map(
          ({
            firstName,
            lastName,
            parentName,
            academicGroup,
            ...rest
          }): UserInfoWithRole => ({
            name: formPersonName(firstName, lastName, parentName),
            group: academicGroup,
            ...rest,
          })
        )
      );
    }
  )
);
