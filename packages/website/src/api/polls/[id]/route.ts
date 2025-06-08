import { authRoute } from '@/api/authRoute';
import { ApiErrorCode } from '@shared/api/errorCodes';
import { badRequest, notFound } from '@shared/responses';
import { UserRole } from '@shared/api/user/types';
import { ObjectId } from 'mongodb';
import { submitPollPayload } from '@shared/api/polls/types';
import { app } from '@/api/app';
import { isValidAnswers } from './validation';

app.post('/polls/:id', async (request, { params: { id } }) => {
  const rawPayload = await request.json();
  const payloadResult = submitPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  const { answers } = payloadResult.data;

  return authRoute(request, UserRole.STUDENT, async (repo, userId) => {
    return await repo.transaction(async (trepo) => {
      const poll = await trepo.polls().findById(id);
      if (poll === null) {
        return notFound();
      }

      if (poll.endDate !== null) {
        return badRequest({
          message: 'Poll is closed',
          code: ApiErrorCode.POLL_CLOSED,
        });
      }

      const objectUserId = new ObjectId(userId);
      const userResponded = poll.respondents.find(
        (respondent) => respondent.userId === objectUserId
      );

      if (userResponded) {
        return badRequest({ message: 'The user has already responded' });
      }

      if (!isValidAnswers(poll.questions, answers)) {
        return badRequest({ message: 'Invalid poll answers' });
      }

      await trepo.polls().addRespondent(id, {
        userId: objectUserId,
        date: new Date(),
        answers,
      });

      return new Response();
    });
  });
});
