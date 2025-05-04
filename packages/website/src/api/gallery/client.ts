import { fetchObject } from '@/utils/fetch';

export function fetchGalleryPage(page: number): Promise<string[]> {
  return fetchObject(`/api/gallery?page=${page}`);
}
