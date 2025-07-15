import { IpResponse, ipResponse } from './types';

export async function getIpLocation(ip: string): Promise<IpResponse | null> {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const rawBody = await response.json();
  const bodyResult = ipResponse.safeParse(rawBody);
  if (!bodyResult.success) {
    console.error(bodyResult.error.message);
    return null;
  }

  const body = bodyResult.data;
  if (body.status === 'success') {
    return body;
  }

  return null;
}
