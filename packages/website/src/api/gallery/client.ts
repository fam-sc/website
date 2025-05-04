import { checkedFetch, fetchObject } from '@/utils/fetch';
import { UploadGalleryImagesPayload } from './payloads';
import { GalleryImageWithEvent } from './types';

export function fetchGalleryPage(page: number): Promise<string[]> {
  return fetchObject(`/api/gallery?page=${page}`);
}

export function uploadGalleryImages(payload: UploadGalleryImagesPayload) {
  const formData = new FormData();
  formData.set('date', payload.date.toISOString());

  if (payload.eventId !== null) {
    formData.set('eventId', payload.eventId);
  }

  for (const file of payload.files) {
    formData.append('files', file);
  }

  return checkedFetch(`/api/gallery`, {
    method: 'POST',
    body: formData,
  });
}

export function fetchGalleryImage(id: string): Promise<GalleryImageWithEvent> {
  return fetchObject(`/api/gallery/${id}`);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await checkedFetch(`/api/gallery/${id}`, {
    method: 'DELETE',
  });
}
