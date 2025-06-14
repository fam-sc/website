type MediaSection = 'events' | 'gallery' | 'user';
type ImageWithSize = `${string}/${number}`;
type MediaPathMap = {
  events: ImageWithSize;
  gallery: ImageWithSize;
  user: string;
};

export type MediaPath = {
  [K in MediaSection]: `${K}/${MediaPathMap[K]}`;
}[MediaSection];

export function getMediaFileUrl(path: MediaPath): string {
  return `${import.meta.env.VITE_MEDIA_URL}/${path}`;
}
