import type { EntryContext } from 'react-router';
import { redirect } from 'react-router';

import { app } from '@/api/app';
import '@/api/routes';

import { renderResponse } from 'virtual:utils/reactDomEnv';
import { getApiEnv } from 'virtual:utils/apiEnv';

import { AppLoadContext } from 'react-router';
import { Repository } from '@data/repo';
import { redirects } from './redirects';
import { internalServerError } from '@shared/responses';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  loadContext = {
    ...loadContext,
    cloudflare: {
      ...loadContext.cloudflare,
      env: getApiEnv(loadContext),
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (import.meta.env.PROD && loadContext.cloudflare !== undefined) {
    Repository.setDefaultConnectionString(
      loadContext.cloudflare.env.MONGO_CONNECTION_STRING
    );
  }

  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/api')) {
    try {
      return await app.handleRequest(request, loadContext.cloudflare.env);
    } catch (error) {
      console.error(error);

      return internalServerError();
    }
  }

  const targetRedirect = redirects[pathname];
  if (targetRedirect !== undefined) {
    return redirect(targetRedirect);
  }

  return renderResponse(
    request,
    routerContext,
    responseStatusCode,
    responseHeaders
  );
}
