import { AddEventPayload } from './types';

export async function addEvent(payload: AddEventPayload) {
  const formData = new FormData();
  formData.set('image', payload.image);
  formData.set('description', payload.description);

  await fetch(`/api/event/add`, {
    method: 'POST',
    body: formData,
  });
}
