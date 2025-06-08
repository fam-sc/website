export function getMediaFileUrl(path: string): string {
  return `${import.meta.env.VITE_MEDIA_URL}/${path}`;
}
