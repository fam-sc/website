import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';

import { app } from '@/api/app';
import '@/api/routes';

import { renderToReadableStream } from 'react-dom/server.edge';
import { AppLoadContext } from 'react-router';
import { Repository } from '@data/repo';
import { getEnvChecked } from '@shared/env';

async function handleApiRequest(request: Request, loadContext: AppLoadContext) {
  let env: Env;
  if (import.meta.env.PROD) {
    env = loadContext.cloudflare.env;
  } else {
    const { ApiR2Bucket } = await import('@shared/r2/api');
    const bucket = new ApiR2Bucket(
      getEnvChecked('MEDIA_ACCOUNT_ID'),
      getEnvChecked('MEDIA_ACCESS_KEY_ID'),
      getEnvChecked('MEDIA_SECRET_ACCESS_KEY'),
      getEnvChecked('MEDIA_BUCKET_NAME')
    );

    env = {
      MONGO_CONNECTION_STRING: getEnvChecked('MONGO_CONNECTION_STRING'),
      RESEND_API_KEY: getEnvChecked('RESEND_API_KEY'),
      MEDIA_BUCKET: bucket,
    };
  }

  return app.handleRequest(request, env);
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  if (import.meta.env.PROD) {
    Repository.setDefaultConnectionString(
      loadContext.cloudflare.env.MONGO_CONNECTION_STRING
    );
  }

  const { pathname } = new URL(request.url);
  if (pathname.startsWith('/api')) {
    return handleApiRequest(request, loadContext);
  }

  let shellRendered = false;
  const userAgent = request.headers.get('user-agent');

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );
  shellRendered = true;

  // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
  // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
