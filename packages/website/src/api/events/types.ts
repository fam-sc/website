import { EventStatus } from '@data/types';
import { ImageSize } from '@shared/image/types';
import { RichTextString } from '@shared/richText/types';
import { infer as zodInfer } from 'zod/v4-mini';

import type { payloadSchema } from './payloads';
export type { EventStatus } from '@data/types';

export type ShortEvent = {
  id: string;
  title: string;
};

export type Event = {
  id: string;
  title: string;
  status: EventStatus;
  date: string;
  description: RichTextString;
  images: ImageSize[];
};

export type WithDescriptionFiles<Image extends File | undefined> = zodInfer<
  typeof payloadSchema
> & {
  image: Image;
  descriptionFiles: File[];
};

export type AddEventPayload = WithDescriptionFiles<File>;
export type EditEventPayload = WithDescriptionFiles<File | undefined>;
