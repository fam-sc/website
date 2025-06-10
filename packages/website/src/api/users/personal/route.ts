import { badRequest, unauthrorized } from '@shared/responses';
import { getSessionIdNumber } from '@shared/api/auth';
import { Repository } from '@data/repo';
import { userPersonalInfo } from '@shared/api/user/payloads';
import { app } from '@/api/app';

app.put('/users/personal', async (request) => {
  const bodyObject = await request.json();
  const piResult = userPersonalInfo.safeParse(bodyObject);
  if (piResult.error) {
    console.error(piResult.error);

    return badRequest();
  }

  const personalInfo = piResult.data;

  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return unauthrorized();
  }

  await using repo = await Repository.openConnection();

  return await repo.transaction(async (trepo) => {
    const session = await trepo.sessions().findBySessionId(sessionId);
    if (session === null) {
      return unauthrorized();
    }

    await repo.users().updatePersonalInfo(session.userId, personalInfo);

    return new Response();
  });
});
