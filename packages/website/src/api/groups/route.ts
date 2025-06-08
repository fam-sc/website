import { ok } from '@shared/responses';
import { getFacultyGroups } from './get';
import { shortenGuid } from '@shared/guid';
import { app } from '@/api/app';

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
