import { getAllFiles } from '@sc-fam/shared';
import { richText } from '@sc-fam/shared/richText/zod.js';
import { object, string } from 'zod/v4-mini';

import {
  AddGuidePayload,
  EditGuidePayload,
  WithDescriptionFiles,
} from './types';

export const payloadSchema = object({
  title: string(),
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

export function parseAddGuidePayload(formData: FormData): AddGuidePayload {
  return parseAbstractPayload(formData, true);
}

export function parseEditGuidePayload(formData: FormData): EditGuidePayload {
  return parseAbstractPayload(formData, false);
}
