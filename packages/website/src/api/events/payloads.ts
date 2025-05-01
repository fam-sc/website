import { parseFormDataToObject } from '@/utils/formData';
import { z } from 'zod';

const date = z.string().pipe(z.coerce.date());

export const addEventPayload = z.object({
  image: z.instanceof(File),
  title: z.string(),
  date,
  description: z.string(),
});

export const editEventPayload = z.object({
  image: z.optional(z.instanceof(File)),
  title: z.string(),
  date,
  description: z.string(),
});

export type AddEventPayload = z.infer<typeof addEventPayload>;
export type EditEventPayload = z.infer<typeof editEventPayload>;

export function parseAddEventPayload(formData: FormData): AddEventPayload {
  return parseFormDataToObject(formData, addEventPayload);
}

export function parseEditEventPayload(formData: FormData): EditEventPayload {
  return parseFormDataToObject(formData, editEventPayload);
}
