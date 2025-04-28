import { AddEventPayload } from './types';

export async function addEvent(payload: AddEventPayload) {
  const formData = new FormData();
  formData.set('title', payload.title);
  formData.set('date', payload.date.toISOString());
  formData.set('description', payload.description);
  formData.set('image', payload.image);

  await fetch(`/api/event/add`, {
    method: 'POST',
    body: formData,
  });
}
