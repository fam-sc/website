import { getEnvChecked } from '../../env';

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
    duplex: 'half',
  } as RequestInit);

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

export async function mediaFileExists(path: string): Promise<boolean> {
  const response = await fetch(getMediaFileUrl(path), {
    method: 'HEAD',
  });

  return response.ok;
}

export function getMediaFileUrl(path: string): string {
  const url = process.env.NEXT_PUBLIC_MEDIA_URL;
  if (url === undefined) {
    throw new Error('No NEXT_PUBLIC_MEDIA_URL in env');
  }

  return `${url}/${path}`;
}
