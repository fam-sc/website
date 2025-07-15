import { Repository } from '@data/repo';
import { badRequest, unauthorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId } from '@/api/auth';
import { userPersonalInfo } from '@/api/users/payloads';

app.put('/users/personal', async (request) => {
  const bodyObject = await request.json();
  const piResult = userPersonalInfo.safeParse(bodyObject);
  if (piResult.error) {
    console.error(piResult.error);

    return badRequest();
  }

  const personalInfo = piResult.data;

  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return unauthorized();
  }

  const repo = Repository.openConnection();

  const session = await repo.sessions().findBySessionId(sessionId);
  if (session === null) {
    return unauthorized();
  }

  await repo.users().updatePersonalInfo(session.userId, personalInfo);

  return new Response();
});
