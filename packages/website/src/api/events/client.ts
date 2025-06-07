import { objectToFormData } from '@shared/formData';
import { AddEventPayload, EditEventPayload } from '@shared/api/events/payloads';
import { ShortEvent } from './types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function fetchAllEventsShort(): Promise<ShortEvent[]> {
  return apiFetchObject(`/events?type=short`, {
    method: 'GET',
  });
}

export async function addEvent(payload: AddEventPayload) {
  await apiCheckedFetch(`/events`, {
    method: 'POST',
    body: objectToFormData(payload),
  });
}

export async function editEvent(id: string, payload: EditEventPayload) {
  await apiCheckedFetch(`/events/${id}`, {
    method: 'PUT',
    body: objectToFormData(payload),
  });
}

export async function deleteEvent(id: string) {
  await apiCheckedFetch(`/events/${id}`, {
    method: 'DELETE',
  });
}
