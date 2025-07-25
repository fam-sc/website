import { UserRole } from '@sc-fam/data';
import { notFound, ok, parseInt } from '@sc-fam/shared';

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
