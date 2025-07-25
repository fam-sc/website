import { Repository } from '@sc-fam/data';

import { app } from '@/api/app';
import { getSessionId, SESSION_ID_COOKIE } from '@/api/auth';

app.post('/users/logOut', async (request: Request) => {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    // We're ok with it. User is already loged out.
    return new Response();
  }

  const repo = Repository.openConnection();
  await repo.sessions().deleteBySessionId(sessionId);

  return new Response(null, {
    headers: {
      // Set empty string to session id and set expires date past current time to make browser delete it.
      'Set-Cookie': `${SESSION_ID_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
});
