import { getCookieValue, parseInt } from '@sc-fam/shared';

import {
  updateCampaignRegistrationClickPlace,
  validateCampaignRequest,
} from '@/campaign/handler';
import { isValidRegistrationClickPlace } from '@/campaign/types';

import { app } from './app';

app.post('/campaign', async (request) => {
  const requestId = getCookieValue(request, 'rid');

  if (requestId !== undefined) {
    try {
      await validateCampaignRequest(requestId);
    } catch (error) {
      console.error(error);
    }
  }

  return new Response();
});

app.post('/registration-click', async (request) => {
  const { searchParams } = new URL(request.url);
  const requestId = getCookieValue(request, 'rid');
  const place = parseInt(searchParams.get('place'));

  if (requestId !== undefined && isValidRegistrationClickPlace(place)) {
    await updateCampaignRegistrationClickPlace(requestId, place);
  }

  return new Response();
});
