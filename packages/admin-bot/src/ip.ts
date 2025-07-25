import { IpResponse } from '@sc-fam/shared/api/ip/types.js';

export function prettyIpLocation(
  location: IpResponse | null,
  ip: string | null
): string | null {
  return location
    ? `${location.country}, ${location.regionName}, ${location.city} (${ip})`
    : ip;
}
