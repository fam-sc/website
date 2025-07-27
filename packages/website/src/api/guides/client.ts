import { apiCheckedFetch } from '../fetch';
import { AddGuidePayload, EditGuidePayload } from './types';

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

export async function addGuide(payload: AddGuidePayload) {
  await apiCheckedFetch(`/guides`, {
    method: 'POST',
    body: payloadToFormData(payload),
  });
}

export async function editGuide(id: number, payload: EditGuidePayload) {
  await apiCheckedFetch(`/guides/${id}`, {
    method: 'PUT',
    body: payloadToFormData(payload),
  });
}

export async function deleteGuide(id: number) {
  await apiCheckedFetch(`/guides/${id}`, {
    method: 'DELETE',
  });
}
