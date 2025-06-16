type MediaSection = 'events' | 'gallery' | 'user' | 'rich-text-image';
type ImageWithSize = `${string}/${number}`;
type MediaPathMap = {
  events: ImageWithSize;
  gallery: ImageWithSize;
  'rich-text-image': ImageWithSize;
  user: string;
};

export type MediaFileSubPath = `${MediaSection}/${string}`;

export type MediaFilePath = {
  [K in MediaSection]: `${K}/${MediaPathMap[K]}`;
}[MediaSection];

export function getMediaBaseUrl(): string {
  return import.meta.env.VITE_MEDIA_URL;
}

export function getMediaFileUrl(path: MediaFilePath): string {
  return `${getMediaBaseUrl()}/${path}`;
}
