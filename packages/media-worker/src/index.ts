function isAuthorized(request: Request, env: Env): boolean {
  return request.headers.get('X-Auth-Key') === env.AUTH_KEY;
}

function nonAuthorized(): Response {
  return new Response('Forbidden', { status: 403 });
}

function notFound(): Response {
  return new Response('Not Found', { status: 404 });
}

function getHeaders(object: R2Object): Headers {
  const updatedOn = object.customMetadata?.updatedOn;

  const headers = new Headers();
  object.writeHttpMetadata(headers);

  if (updatedOn !== undefined) {
    headers.set('X-Updated-On', updatedOn);
  }

  return headers;
}

function pathnameToKey(value: string): string {
  const slashIndex = value.lastIndexOf('/');
  if (slashIndex !== -1) {
    const lastPart = value.slice(slashIndex + 1);
    const dotIndex = lastPart.lastIndexOf('.');

    if (dotIndex !== -1) {
      const name = lastPart.slice(0, dotIndex);
      const prefix = value.slice(0, slashIndex);

      return `${prefix}/${name}`;
    }
  }

  return value;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { MEDIA_BUCKET } = env;
    const url = new URL(request.url);
    const key = pathnameToKey(url.pathname.slice(1));

    switch (request.method) {
      case 'DELETE': {
        if (!isAuthorized(request, env)) {
          return nonAuthorized();
        }

        await MEDIA_BUCKET.delete(key);

        return new Response();
      }
      case 'PUT': {
        if (!isAuthorized(request, env)) {
          return nonAuthorized();
        }

        const now = new Date().toISOString();
        await MEDIA_BUCKET.put(key, request.body, {
          customMetadata: { updatedOn: now },
        });

        return new Response();
      }
      case 'GET': {
        const object = await MEDIA_BUCKET.get(key);

        if (object === null) {
          return notFound();
        }

        return new Response(object.body, {
          headers: getHeaders(object),
        });
      }
      case 'HEAD': {
        const object = await MEDIA_BUCKET.head(key);

        if (object === null) {
          return notFound();
        }

        return new Response(null, {
          headers: getHeaders(object),
        });
      }
      default: {
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'PUT, GET, DELETE, HEAD',
          },
        });
      }
    }
  },
} satisfies ExportedHandler<Env>;
