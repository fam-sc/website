import { normalizeGuid } from '@shared/guid';
import { notFound, ok } from '@shared/responses';

import { app } from '@/api/app';

import { getFacultyGroupById } from '../get';

app.get('/groups/:id', async (_request, { params: { id } }) => {
  const group = await getFacultyGroupById(normalizeGuid(id));

  return group !== null ? ok(group) : notFound();
});
