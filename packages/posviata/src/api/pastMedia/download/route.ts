import { notFound } from '@sc-fam/shared';
import { string } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';

app.get(
  '/past-media/download',
  middlewareHandler(
    searchParams({ path: string() }),
    async ({ env, data: [{ path }] }) => {
      const object = await env.MEDIA_BUCKET.get(path);
      if (object === null) {
        return notFound();
      }

      const dotIndex = path.lastIndexOf('/');
      const name = path.slice(dotIndex + 1);

      const headers = new Headers();
      headers.set('Content-Disposition', `attachment; filename="${name}"`);
      object.writeHttpMetadata(headers);

      return new Response(object.body, {
        headers,
      });
    }
  )
);
