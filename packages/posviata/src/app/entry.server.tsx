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
  routerContext: EntryContext
) {
  return renderResponse(
    request,
    routerContext,
    responseStatusCode,
    responseHeaders
  );
}
