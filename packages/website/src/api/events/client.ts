import { objectToFormData } from '@/utils/formData';
import { AddEventPayload, EditEventPayload } from './payloads';
import { checkedFetch } from '@/utils/fetch';

export async function addEvent(payload: AddEventPayload) {
  await checkedFetch(`/api/events`, {
    method: 'POST',
    body: objectToFormData(payload),
  });
}

export async function editEvent(id: string, payload: EditEventPayload) {
  await checkedFetch(`/api/events/${id}`, {
    method: 'PUT',
    body: objectToFormData(payload),
  });
}

export async function deleteEvent(id: string) {
  await checkedFetch(`/api/events/${id}`, {
    method: 'DELETE',
  });
}
