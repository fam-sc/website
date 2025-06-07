import { UploadGalleryImagesPayload } from '@shared/api/gallery/payloads';
import {
  GalleryImageWithEvent,
  GalleryImageWithSize,
} from '@shared/api/gallery/types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function fetchGalleryPage(
  page: number
): Promise<GalleryImageWithSize[]> {
  return apiFetchObject(`/api/gallery?page=${page}`);
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

export function fetchGalleryImage(id: string): Promise<GalleryImageWithEvent> {
  return apiFetchObject(`/gallery/${id}`);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await apiCheckedFetch(`/gallery/${id}`, {
    method: 'DELETE',
  });
}
