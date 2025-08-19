import { RegistrationClickPlace } from '@/campaign/types';

export function validateCampaignRequest() {
  return fetch(`/api/campaign`, { method: 'POST' });
}

export function postUserClickedRegistration(place: RegistrationClickPlace) {
  return fetch(`/api/registration-click?place=${place}`, { method: 'POST' });
}
