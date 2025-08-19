import { AppLoadContext, EntryContext } from 'react-router';
import { renderResponse } from 'virtual:utils/reactDomEnv';

import {
  handleCampaignRequest,
  handleRegistrationClickRequest,
} from '@/api/campaign';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  const { env } = loadContext.cloudflare;
  const { pathname } = new URL(request.url);

  if (request.method === 'POST') {
    if (pathname === '/api/campaign') {
      return handleCampaignRequest(request, env);
    } else if (pathname === `/api/registration-click`) {
      return handleRegistrationClickRequest(request, env);
    }
  }

  return renderResponse(
    request,
    routerContext,
    responseStatusCode,
    responseHeaders
  );
}
