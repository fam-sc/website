import { EventStatus } from '@data/types';
import { getAllFiles } from '@shared/formData';
import { richText } from '@shared/richText/zod';
import { coerce, literal, object, pipe, string, union, z } from 'zod/v4-mini';

const status = union([
  literal(EventStatus.PENDING),
  literal(EventStatus.ENDED),
]);

const payloadSchema = object({
  status,
  title: string(),
  date: pipe(string(), coerce.date()),
  description: richText,
});

type WithDescriptionFiles<Image extends File | undefined> = z.infer<
  typeof payloadSchema
> & {
  image: Image;
  descriptionFiles: File[];
};

export type AddEventPayload = WithDescriptionFiles<File>;

export type EditEventPayload = WithDescriptionFiles<File | undefined>;

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
