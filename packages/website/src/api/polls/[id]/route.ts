import { UserRole } from '@sc-fam/data';
import { badRequest, notFound, parseInt } from '@sc-fam/shared';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';
import { ApiErrorCode } from '@/api/errorCodes';

import { submitPollPayload } from '../schema';
import { isValidAnswers } from './validation';

app.post('/polls/:id', async (request, { params: { id } }) => {
  const rawPayload = await request.json();
  const payloadResult = submitPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  const numberId = parseInt(id);
  if (numberId === undefined) {
    return badRequest();
  }

  const { answers } = payloadResult.data;

  return authRoute(request, UserRole.STUDENT, async (repo, userId) => {
    const [poll, userResponded] = await repo.batch([
      repo.polls().findEndDateAndQuestionsById(numberId),
      repo.polls().hasUserResponded(numberId, userId),
    ]);

    if (poll === null) {
      return notFound();
    }

    if (poll.endDate !== null) {
      return badRequest({
        message: 'Poll is closed',
        code: ApiErrorCode.POLL_CLOSED,
      });
    }

    if (userResponded) {
      return badRequest({ message: 'The user has already responded' });
    }

    if (!isValidAnswers(poll.questions, answers)) {
      return badRequest({ message: 'Invalid poll answers' });
    }

    await repo.polls().addRespondent(numberId, {
      date: Date.now(),
      userId,
      answers,
    });

    return new Response();
  });
});
