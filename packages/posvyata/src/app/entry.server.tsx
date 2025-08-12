import { AppLoadContext, EntryContext } from 'react-router';
import { renderResponse } from 'virtual:utils/reactDomEnv';

import { handleCampaignRequest } from '@/api/campaign';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  const { pathname } = new URL(request.url);
  if (request.method === 'POST' && pathname === '/api/campaign') {
    return handleCampaignRequest(request, loadContext.cloudflare.env);
  }

  return renderResponse(
    request,
    routerContext,
    responseStatusCode,
    responseHeaders
  );
}
