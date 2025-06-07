import { app } from '@/app';
import { getFacultyGroupById } from '../get';
import { notFound, ok } from '@shared/responses';
import { normalizeGuid } from '@shared/guid';

app.get('/groups/:id', async (_request, { params: { id } }) => {
  const group = await getFacultyGroupById(normalizeGuid(id));

  return group !== null ? ok(group) : notFound();
});
