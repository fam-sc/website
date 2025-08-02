import { Repository, UserRole } from '@sc-fam/data';

import { app } from '../app';

export function setupDevRoute() {
  app.post('/dev', async (_, { env }) => {
    await Repository.init(env.DB);

    const repo = Repository.openConnection();

    await repo.deleteAll();

    await repo.users().insert({
      firstName: 'First name',
      lastName: 'Last name',
      academicGroup: '123',
      adminBotUserId: env.DEV_ADMIN_USER_ID,
      email: 'admin@admin.com',
      hasAvatar: 1,
      parentName: null,
      passwordHash: '',
      role: UserRole.ADMIN,
      telnum: null,
    });
    await repo.users().insert({
      firstName: 'First name',
      lastName: 'Last name',
      academicGroup: '123',
      adminBotUserId: env.DEV_ADMIN_USER_ID,
      email: 'test@test.com',
      hasAvatar: 1,
      parentName: null,
      passwordHash: '',
      role: UserRole.STUDENT_NON_APPROVED,
      telnum: null,
    });

    return new Response();
  });
}
