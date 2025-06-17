import { authRoute } from '@/api/authRoute';
import { notFound, ok } from '@shared/responses';
import { UserRole } from '@data/types/user';
import { pollResultsToTable } from './transform';
import { app } from '@/api/app';

app.get('/polls/:id/table', async (request, { params: { id } }) => {
  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

    if (poll === null) {
      return notFound();
    }

    return ok(pollResultsToTable(poll.questions, poll.respondents));
  });
});
