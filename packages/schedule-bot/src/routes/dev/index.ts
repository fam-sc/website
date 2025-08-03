import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, parseInt } from '@sc-fam/shared';

import { handleUpdate } from '@/controller';

import { app } from '../app';

if (DEV) {
  app.post('/dev', async (request, { env }) => {
    const { searchParams } = new URL(request.url);
    const tgId = parseInt(searchParams.get('tgId'));
    const group = searchParams.get('group');

    if (tgId === undefined || group === null) {
      return badRequest();
    }

    await Repository.init(env.DB);
    const repo = Repository.openConnection(env.DB);

    const userId = await repo.users().add({
      academicGroup: group,
      adminBotUserId: null,
      email: '',
      firstName: '',
      lastName: '',
      parentName: '',
      hasAvatar: 1,
      passwordHash: '',
      role: UserRole.ADMIN,
    });

    await repo.scheduleBotUsers().addUser(userId, tgId);

    return new Response(JSON.stringify({ userId }));
  });

  app.post('/dev/send', async (request) => {
    const { searchParams } = new URL(request.url);
    const tgId = parseInt(searchParams.get('tgId'));
    if (tgId === undefined) {
      return badRequest();
    }

    const text = await request.text();

    await handleUpdate({
      update_id: 1,
      message: {
        chat: { id: tgId, type: '' },
        from: { id: tgId, first_name: '', is_bot: false },
        date: 0,
        message_id: 1,
        text,
      },
    });

    return new Response();
  });
}
