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
