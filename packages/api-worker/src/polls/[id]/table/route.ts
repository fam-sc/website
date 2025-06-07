import { authRoute } from '@/authRoute';
import { notFound, ok } from '@shared/responses';
import { UserRole } from '@shared/api/user/types';
import { pollResultsToTable } from './transform';
import { app } from '@/app';

app.get('/polls/:id/table', async (request, { params: { id } }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

    if (poll === null) {
      return notFound();
    }

    return ok(pollResultsToTable(poll.questions, poll.respondents));
  });
});
