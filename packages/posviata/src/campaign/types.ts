export const enum CampaignReferrer {
  NONE = -1,
  TIKTOK = 0,
  INSTAGRAM = 1,
  TELEGRAM = 2,
}

export const enum RegistrationClickPlace {
  HEADER = 0,
  FOOTER = 1,
}

export function isValidCampaignReferrer(
  value: unknown
): value is CampaignReferrer {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= -1 &&
    value <= 2
  );
}

export function isValidRegistrationClickPlace(
  value: unknown
): value is RegistrationClickPlace {
  return (
    value === RegistrationClickPlace.HEADER ||
    value === RegistrationClickPlace.FOOTER
  );
}
