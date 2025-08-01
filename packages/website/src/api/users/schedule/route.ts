import { UserRole } from '@sc-fam/data';
import { badRequest } from '@sc-fam/shared';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';

import { updateScheduleBotOptionsPayload } from './schema';

app.put('/users/schedule', async (request) => {
  const rawPayload = await request.json();
  const payloadResult = updateScheduleBotOptionsPayload.safeParse(rawPayload);
  if (!payloadResult.success) {
    return badRequest();
  }

  const payload = payloadResult.data;

  return authRoute(
    request,
    UserRole.STUDENT_NON_APPROVED,
    async (repo, userId) => {
      await repo.scheduleBotUsers().updateUserOptions(userId, payload);

      return new Response();
    }
  );
});
