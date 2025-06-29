import '@/api/routes';

import { Repository } from '@data/repo';
import { internalServerError } from '@shared/responses';
import type { EntryContext } from 'react-router';
import { redirect } from 'react-router';
import { AppLoadContext } from 'react-router';
import { getApiEnv } from 'virtual:utils/apiEnv';
import { renderResponse } from 'virtual:utils/reactDomEnv';

import { app } from '@/api/app';

import { redirects } from './redirects';

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

  Repository.setDefaultDatabase(loadContext.cloudflare.env.DB);

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
