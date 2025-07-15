import { IpResponse } from '@shared/api/ip/types';

export function prettyIpLocation(
  location: IpResponse | null,
  ip: string | null
): string | null {
  return location
    ? `${location.country}, ${location.regionName}, ${location.city} (${ip})`
    : ip;
}
