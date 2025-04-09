function isAuthorized(request: Request): boolean {
  return request.headers.get('X-Auth-Key') === process.env.AUTH_KEY;
}

function nonAuthorized(): Response {
  return new Response('Forbidden', { status: 403 });
}

export default {
  async fetch(request: Request, { MEDIA_BUCKET }: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'DELETE': {
        if (!isAuthorized(request)) {
          return nonAuthorized();
        }

        await MEDIA_BUCKET.delete(key);

        return new Response(undefined, { status: 200 });
      }
      case 'PUT': {
        if (!isAuthorized(request)) {
          return nonAuthorized();
        }

        await MEDIA_BUCKET.put(key, request.body);

        return new Response(undefined, { status: 200 });
      }
      case 'GET': {
        const object = await MEDIA_BUCKET.get(key);

        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);

        return new Response(object.body, {
          headers,
        });
      }
      default: {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'PUT, GET, DELETE',
          },
        });
      }
    }
  },
} satisfies ExportedHandler<Env>;
