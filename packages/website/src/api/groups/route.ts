import { Repository } from '@data/repo';
import { shortenGuid } from '@shared/guid';
import { ok } from '@shared/responses';

import { app } from '@/api/app';

app.get('/groups', async () => {
  const repo = Repository.openConnection();

  const result = await repo.groups().all().get();
  result.sort((a, b) => a.name.localeCompare(b.name, 'uk-UA'));

  return ok(
    result.map((item) => ({
      campusId: shortenGuid(item.campusId),
      name: item.name,
    }))
  );
});
