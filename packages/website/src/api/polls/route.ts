import { UserRole } from '@sc-fam/data';
import { badRequest } from '@sc-fam/shared';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';

import { addPollPayload } from './schema';

app.post('/polls', async (request) => {
  const rawPayload = await request.json();
  const payloadResult = addPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  const { title, questions } = payloadResult.data;

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.polls().insertPoll({
      startDate: Date.now(),
      endDate: null,
      title,
      questions,
    });

    return new Response();
  });
});
