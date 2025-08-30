import { isNull } from '@sc-fam/shared-sql/builder';

import { repository } from '@/data/repo';

import { CampaignReferrer, RegistrationClickPlace } from './types';

export async function registerCampaignRequest(
  referrer: CampaignReferrer,
  userAgent: string | null
) {
  const id = crypto.randomUUID();
  const now = Date.now();

  await repository.campaign().insert({
    request_id: id,
    referrer,
    start_time: now,
    user_agent: userAgent,
  });

  return id;
}

export async function validateCampaignRequest(requestId: string) {
  await repository.campaign().updateWhere(
    {
      request_id: requestId,
      validation_time: isNull(),
    },
    { validation_time: Date.now() }
  );
}

export async function updateCampaignRegistrationClickPlace(
  requestId: string,
  place: RegistrationClickPlace
) {
  await repository.campaign().updateWhere(
    {
      request_id: requestId,
      registration_place: isNull(),
    },
    { registration_place: place }
  );
}
