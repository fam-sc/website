import { AddEventPayload, EditEventPayload, Event } from '@/api/events/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';
import { ShortEvent } from './types';

export function fetchAllEventsShort(): Promise<ShortEvent[]> {
  return apiFetchObject(`/events?type=short`);
}

export function getLatestEvents(): Promise<Event[]> {
  return apiFetchObject('/events/latest');
}

function payloadToFormData({
  image,
  descriptionFiles,
  ...rest
}: {
  image?: File;
  descriptionFiles: File[];
}): FormData {
  const formData = new FormData();
  if (image) {
    formData.set('image', image);
  }

  for (const file of descriptionFiles) {
    formData.append('descriptionFiles', file);
  }

  formData.set('info', JSON.stringify(rest));

  return formData;
}

export async function addEvent(payload: AddEventPayload) {
  await apiCheckedFetch(`/events`, {
    method: 'POST',
    body: payloadToFormData(payload),
  });
}

export async function editEvent(id: number, payload: EditEventPayload) {
  await apiCheckedFetch(`/events/${id}`, {
    method: 'PUT',
    body: payloadToFormData(payload),
  });
}

export async function deleteEvent(id: number) {
  await apiCheckedFetch(`/events/${id}`, {
    method: 'DELETE',
  });
}
