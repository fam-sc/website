import { objectToFormData } from '@/utils/formData';
import { AddEventPayload, EditEventPayload } from './payloads';

export async function addEvent(payload: AddEventPayload) {
  await fetch(`/api/event/add`, {
    method: 'POST',
    body: objectToFormData(payload),
  });
}

export async function editEvent(id: string, payload: EditEventPayload) {
  await fetch(`/api/event/edit/${id}`, {
    method: 'POST',
    body: objectToFormData(payload),
  });
}
