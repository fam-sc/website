import { CampaignReferrer, RegistrationClickPlace } from './types';

export async function registerCampaignRequest(
  env: Env,
  referrer: CampaignReferrer,
  userAgent: string | null
) {
  const id = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(
    `INSERT INTO campaign (request_id, referrer, start_time, validation_time, user_agent) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(id, referrer, now, null, userAgent)
    .run();

  return id;
}

export async function validateCampaignRequest(env: Env, requestId: string) {
  const now = Date.now();

  await env.DB.prepare(
    `UPDATE campaign SET validation_time=? WHERE request_id=? AND validation_time IS NULL`
  )
    .bind(now, requestId)
    .run();
}

export async function updateCampaignRegistrationClickPlace(
  env: Env,
  requestId: string,
  place: RegistrationClickPlace
) {
  await env.DB.prepare(
    `UPDATE campaign SET registration_place=? WHERE request_id=? AND registration_place IS NULL`
  )
    .bind(place, requestId)
    .run();
}
