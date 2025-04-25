import { getEnvChecked } from '@/utils/env';

export function getMediaFileUrl(path: string): string {
  return `${getEnvChecked('NEXT_PUBLIC_MEDIA_URL')}/${path}`;
}

export function fetchMediaFile(path: string): Promise<Response> {
  return fetch(getMediaFileUrl(path), { method: 'GET' });
}

async function putDeleteMediaFile(
  path: string,
  method: string,
  body?: BodyInit
): Promise<void> {
  const auth = getEnvChecked('MEDIA_AUTH_KEY');
  const response = await fetch(getMediaFileUrl(path), {
    method,
    headers: { 'X-Auth-Key': auth },
    body,
  });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
}

export function putMediaFile(path: string, body: BodyInit): Promise<void> {
  return putDeleteMediaFile(path, 'PUT', body);
}

export function deleteMediaFile(path: string): Promise<void> {
  return putDeleteMediaFile(path, 'DELETE');
}
