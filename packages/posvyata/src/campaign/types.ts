export const enum CampaignReferrer {
  TIKTOK = 0,
  INSTAGRAM = 1,
  TELEGRAM = 2,
}

export function isValidCampaignReferrer(
  value: unknown
): value is CampaignReferrer {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 2
  );
}
