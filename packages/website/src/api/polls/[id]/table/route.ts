import { UserRole } from '@data/types/user';
import { parseInt } from '@shared/parseInt';
import { notFound, ok } from '@shared/responses';

import { app } from '@/api/app';
import { authRoute } from '@/api/authRoute';

import { pollResultsToTable } from './transform';

app.get('/polls/:id/table', async (request, { params }) => {
  const id = parseInt(params.id);
  if (id === undefined) {
    return notFound();
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

    if (poll === null) {
      return notFound();
    }

    return ok(pollResultsToTable(poll.questions, poll.respondents));
  });
});
