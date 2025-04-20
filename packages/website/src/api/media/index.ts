import { getEnvChecked } from '@/utils/env';
import { ensureOkResponse, getJsonOrError } from '@/utils/fetch';

export function getMediaFileUrl(path: string): string {
  return `https://media.sc-fam.workers.dev/${path}`;
}

export function fetchMediaFile(path: string): Promise<Response> {
  return fetch(getMediaFileUrl(path), { method: 'GET' });
}

export async function fetchMediaObject<T>(
  path: string
): Promise<T | undefined> {
  const response = await fetchMediaFile(path);

  if (response.ok) {
    return (await response.json()) as T;
  }

  if (response.status === 404) {
    return undefined;
  }

  throw new Error(response.statusText);
}

function authFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(getMediaFileUrl(path), {
    ...init,
    headers: { 'X-Auth-Key': getEnvChecked('MEDIA_AUTH_KEY') },
  });
}

async function putDeleteMediaFile(
  path: string,
  method: string,
  body?: BodyInit
): Promise<void> {
  const response = await authFetch(path, { method, body });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
}

export function putMediaFile(path: string, body: BodyInit): Promise<void> {
  return putDeleteMediaFile(path, 'PUT', body);
}

export function putMediaObject(path: string, value: unknown): Promise<void> {
  return putMediaFile(path, JSON.stringify(value));
}

export async function putMediaFileViaUrl(
  path: string,
  url: string
): Promise<void> {
  const { ok, body, statusText } = await fetch(url);

  if (ok) {
    ensureOkResponse(
      await authFetch(path, {
        method: 'PUT',
        body,
        duplex: 'half',
      } as RequestInit)
    );
  }

  throw new Error(statusText);
}

export function deleteMediaFile(path: string): Promise<void> {
  return putDeleteMediaFile(path, 'DELETE');
}

export async function listMediaFiles(prefix: string): Promise<string[]> {
  const response = await authFetch(`list?prefix=${prefix}`);

  return getJsonOrError(response);
}
