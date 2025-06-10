import { parseFormDataToObject } from '../../formData';
import { z } from 'zod/v4-mini';

const status = z.enum(['pending', 'ended']);

export const addEventPayload = z.object({
  image: z.instanceof(File),
  status,
  title: z.string(),
  date: z.date(),
  description: z.string(),
});

export const editEventPayload = z.object({
  image: z.optional(z.instanceof(File)),
  status,
  title: z.string(),
  date: z.date(),
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
