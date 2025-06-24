import { UploadGalleryImagesPayload } from '@/api/gallery/payloads';
import {
  GalleryImageWithEvent,
  GalleryImageWithSizes,
} from '@/api/gallery/types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function fetchGalleryPage(
  page: number
): Promise<GalleryImageWithSizes[]> {
  return apiFetchObject(`/gallery?page=${page}`);
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

  return apiCheckedFetch(`/gallery`, {
    method: 'POST',
    body: formData,
  });
}

export function fetchGalleryImage(id: number): Promise<GalleryImageWithEvent> {
  return apiFetchObject(`/gallery/${id}`);
}

export async function deleteGalleryImage(id: number): Promise<void> {
  await apiCheckedFetch(`/gallery/${id}`, {
    method: 'DELETE',
  });
}
