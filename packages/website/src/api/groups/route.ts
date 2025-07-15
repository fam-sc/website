import { shortenGuid } from '@shared/guid';
import { ok } from '@shared/responses';

import { app } from '@/api/app';

import { getFacultyGroups } from './get';

app.get('/groups', async () => {
  const result = await getFacultyGroups();
  result.sort((a, b) => a.name.localeCompare(b.name, 'uk-UA'));

  return ok(
    result.map((item) => ({
      campusId: shortenGuid(item.campusId),
      name: item.name,
    }))
  );
});
