import { fetchObject } from '@sc-fam/shared';

import { RegistrationClickPlace } from '@/campaign/types';

import { PastMediaEntry } from './pastMedia/types';

export function validateCampaignRequest() {
  return fetch(`/api/campaign`, { method: 'POST' });
}

export function postUserClickedRegistration(place: RegistrationClickPlace) {
  return fetch(`/api/registration-click?place=${place}`, { method: 'POST' });
}

export function getPastMediaEntryPage(year: number, lastId?: number) {
  let url = `/api/past-media?year=${year}`;
  if (lastId !== undefined) {
    url += `&lastId=${lastId}`;
  }

  return fetchObject<PastMediaEntry[]>(url);
}
