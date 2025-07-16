import { MediaFilePath } from './types';

export function getMediaBaseUrl(): string {
  return import.meta.env.VITE_MEDIA_URL;
}

export function getMediaFileUrl(path: MediaFilePath): string {
  return `${getMediaBaseUrl()}/${path}`;
}

export async function putMediaFileViaUrl(
  bucket: R2Bucket,
  key: string,
  url: string
) {
  const response = await fetch(url);

  await bucket.put(key, response.body);
}
