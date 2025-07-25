import { Repository } from '@sc-fam/data';
import { badRequest, unauthorized } from '@sc-fam/shared';

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
