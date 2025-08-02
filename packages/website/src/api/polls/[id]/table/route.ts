import { Repository, UserRole } from '@sc-fam/data';
import { notFound, ok } from '@sc-fam/shared';
import { int, middlewareHandler, params } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

import { pollResultsToTable } from './transform';

app.get(
  '/polls/:id/table',
  middlewareHandler(
    params({ id: int(notFound) }),
    auth({ minRole: UserRole.ADMIN }),
    async ({ data: [{ id }] }) => {
      const repo = Repository.openConnection();
      const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

      if (poll === null) {
        return notFound();
      }

      return ok(pollResultsToTable(poll.questions, poll.respondents));
    }
  )
);
