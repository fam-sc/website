import { EventStatus } from '@sc-fam/data';
import { getAllFiles } from '@sc-fam/shared';
import { richText } from '@sc-fam/shared/richText/zod.js';
import { slug } from '@sc-fam/shared/slugSchema.js';
import {
  coerce,
  literal,
  minLength,
  object,
  pipe,
  string,
  union,
} from 'zod/v4-mini';

import {
  AddEventPayload,
  EditEventPayload,
  WithDescriptionFiles,
} from './types';

const status = union([
  literal(EventStatus.PENDING),
  literal(EventStatus.ENDED),
]);

export const payloadSchema = object({
  status,
  title: string().check(minLength(1)),
  slug: slug,
  date: pipe(string(), coerce.date()),
  description: richText,
});

function parseAbstractPayload<Image extends File | undefined>(
  formData: FormData,
  requireImage: boolean
): WithDescriptionFiles<Image> {
  const info = formData.get('info');
  if (info === null || typeof info !== 'string') {
    throw new Error('Info is not string');
  }

  const image = formData.get('image');
  if (image === null) {
    if (requireImage) {
      throw new Error('Image is null');
    }
  } else if (!(image instanceof File)) {
    throw new TypeError('Image is not file');
  }

  const descriptionFiles = getAllFiles(formData, 'descriptionFiles');

  const rest = payloadSchema.parse(JSON.parse(info));

  return {
    image: image as Image,
    descriptionFiles,
    ...rest,
  };
}

export function parseAddEventPayload(formData: FormData): AddEventPayload {
  return parseAbstractPayload(formData, true);
}

export function parseEditEventPayload(formData: FormData): EditEventPayload {
  return parseAbstractPayload(formData, false);
}
