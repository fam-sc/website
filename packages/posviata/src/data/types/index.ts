import { CampaignReferrer, RegistrationClickPlace } from '@/campaign/types';

export type CampaignEntry = {
  request_id: string;
  referrer: CampaignReferrer | null;
  start_time: number;
  validation_time: number | null;
  user_agent: string | null;
  registration_place: RegistrationClickPlace | null;
};

export const enum PastMediaEntryType {
  IMAGE = 0,
  VIDEO = 1,
}

export type PastMediaEntry = {
  id: number;
  type: PastMediaEntryType;
  path: string;
  year: number;
};
