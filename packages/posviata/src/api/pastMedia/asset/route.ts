import { badRequest, notFound } from '@sc-fam/shared';

import { app } from '@/api/app';

app.get('/past-media/asset', async (request, { env }) => {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (path === null) {
    return badRequest({ message: 'No path' });
  }

  const object = await env.MEDIA_BUCKET.get(path);
  if (object === null) {
    return notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  return new Response(object.body, {
    headers,
  });
});
