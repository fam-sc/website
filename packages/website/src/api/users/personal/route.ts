import { badRequest, unauthrorized } from '@shared/responses';
import { getSessionId } from '@/api/auth';
import { Repository } from '@data/repo';
import { userPersonalInfo } from '@/api/users/payloads';
import { app } from '@/api/app';

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
    return unauthrorized();
  }

  const repo = Repository.openConnection();

  const session = await repo.sessions().findBySessionId(sessionId);
  if (session === null) {
    return unauthrorized();
  }

  await repo.users().updatePersonalInfo(session.userId, personalInfo);

  return new Response();
});
