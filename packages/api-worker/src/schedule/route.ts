import { badRequest, notFound, ok } from '@shared/responses';
import { getScheduleForGroup } from './get';
import { normalizeGuid } from '@shared/guid';
import { authRoute } from '@/authRoute';
import { UserRole } from '@shared/api/user/types';
import { isValidPayload } from './links';
import { app } from '@/app';

app.get('/schedule', async (request) => {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  const result = await getScheduleForGroup(normalizeGuid(group));

  return ok(result);
});

app.patch('/schedule', async (request) => {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const group = searchParams.get('group');

  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  if (type !== 'link') {
    return badRequest({ message: 'Invalid type' });
  }

  const payload = await request.json();
  if (!isValidPayload(payload)) {
    return badRequest({ message: 'Invalid payload' });
  }

  return authRoute(request, UserRole.GROUP_HEAD, async (repo) => {
    return await repo.transaction(async (trepo) => {
      const result = await trepo
        .schedule()
        .updateLinks(normalizeGuid(group), payload);

      if (result.matchedCount === 0) {
        return notFound();
      }

      return new Response();
    });
  });
});
