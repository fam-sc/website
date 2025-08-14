import { getCookieValue, parseInt } from '@sc-fam/shared';

import {
  updateCampaignRegistrationClickPlace,
  validateCampaignRequest,
} from '@/campaign/handler';
import { isValidRegistrationClickPlace } from '@/campaign/types';

export async function handleCampaignRequest(request: Request, env: Env) {
  const requestId = getCookieValue(request, 'rid');

  if (requestId !== undefined) {
    await validateCampaignRequest(env, requestId);
  }

  return new Response();
}

export async function handleRegistrationClickRequest(
  request: Request,
  env: Env
) {
  const { searchParams } = new URL(request.url);
  const requestId = getCookieValue(request, 'rid');
  const place = parseInt(searchParams.get('place'));

  if (requestId !== undefined && isValidRegistrationClickPlace(place)) {
    await updateCampaignRegistrationClickPlace(env, requestId, place);
  }

  return new Response();
}
