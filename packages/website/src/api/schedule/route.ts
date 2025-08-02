import { Repository, UserRole } from '@sc-fam/data';
import { badRequest, normalizeGuid, notFound, ok } from '@sc-fam/shared';
import { invalid, string } from '@sc-fam/shared/minivalidate';
import { json, middlewareHandler, searchParams } from '@sc-fam/shared/router';
import { getScheduleForGroup } from '@sc-fam/shared-schedule';

import { app } from '@/api/app';
import { auth } from '@/api/authRoute';

import { isValidPayload } from './links';

app.get('/schedule', async (request) => {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  const result = await getScheduleForGroup(normalizeGuid(group));
  if (result === null) {
    return notFound();
  }

  return ok(result);
});

app.patch(
  '/schedule',
  middlewareHandler(
    searchParams({
      group: string(),
      type: (input) => (input === 'link' ? input : invalid('Invalid type')),
    }),
    json(),
    auth({ minRole: UserRole.GROUP_HEAD }),
    async ({ data: [{ group }, payload] }) => {
      if (!isValidPayload(payload)) {
        return badRequest({ message: 'Invalid payload' });
      }

      const repo = Repository.openConnection();
      const { changes } = await repo
        .schedule()
        .updateLinks(normalizeGuid(group), payload);

      return changes > 0 ? new Response() : notFound();
    }
  )
);
