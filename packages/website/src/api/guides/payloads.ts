import { getAllFiles } from '@sc-fam/shared';
import { richText } from '@sc-fam/shared/richText/zod.js';
import { slug } from '@sc-fam/shared/slugSchema.js';
import { minLength, object, string } from 'zod/v4-mini';

import { AddGuidePayload, EditGuidePayload } from './types';

export const payloadSchema = object({
  title: string().check(minLength(1)),
  slug,
  description: richText,
});

function parseAbstractPayload(formData: FormData): AddGuidePayload {
  const info = formData.get('info');
  if (info === null || typeof info !== 'string') {
    throw new Error('Info is not string');
  }

  const image = formData.get('image');
  if (image !== null && !(image instanceof File)) {
    throw new TypeError('Image is not file');
  }

  const descriptionFiles = getAllFiles(formData, 'descriptionFiles');

  const rest = payloadSchema.parse(JSON.parse(info));

  return {
    image: image ?? undefined,
    descriptionFiles,
    ...rest,
  };
}

export function parseAddGuidePayload(formData: FormData): AddGuidePayload {
  return parseAbstractPayload(formData);
}

export function parseEditGuidePayload(formData: FormData): EditGuidePayload {
  return parseAbstractPayload(formData);
}
