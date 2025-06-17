import { authRoute } from '@/api/authRoute';
import { badRequest } from '@shared/responses';
import { UserRole } from '@data/types/user';
import { app } from '@/api/app';
import { addPollPayload } from '@/api/polls/types';

app.post('/polls', async (request) => {
  const rawPayload = await request.json();
  const payloadResult = addPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.polls().insert({
      startDate: new Date(),
      endDate: null,
      respondents: [],
      ...payloadResult.data,
    });

    return new Response();
  });
});
