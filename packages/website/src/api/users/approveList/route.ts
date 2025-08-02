import { Repository, UserRole } from '@sc-fam/data';
import { formPersonName, ok } from '@sc-fam/shared';
import { middlewareHandler } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth, userWithRoleGetter } from '@/api/authRoute';
import { UserInfo } from '@/api/users/types';

app.get(
  '/users/approveList',
  middlewareHandler(
    auth({
      minRole: UserRole.GROUP_HEAD,
      get: userWithRoleGetter,
    }),
    async ({ data: [user] }) => {
      const { role, academicGroup } = user;

      const repo = Repository.openConnection();
      const users = await repo
        .users()
        .findAllNonApprovedUsers(
          role === UserRole.ADMIN ? undefined : academicGroup
        );

      return ok(
        users.map(
          ({
            id,
            firstName,
            lastName,
            parentName,
            email,
            academicGroup,
            hasAvatar,
          }): UserInfo => ({
            id,
            name: formPersonName(firstName, lastName, parentName),
            email,
            group: academicGroup,
            hasAvatar: hasAvatar ?? false,
          })
        )
      );
    }
  )
);
