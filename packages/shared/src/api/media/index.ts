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
