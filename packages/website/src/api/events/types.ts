import { EventStatus, ImageData } from '@sc-fam/data';
import { RichTextString } from '@sc-fam/shared/richText';
import { infer as zodInfer } from 'zod/v4-mini';

import type { payloadSchema } from './payloads';
export type { EventStatus } from '@sc-fam/data';

export type ShortEvent = {
  id: number;
  title: string;
};

export type Event = {
  id: number;
  slug: string;
  title: string;
  status: EventStatus;
  date: string;
  description: RichTextString;
  images: ImageData;
};

export type WithDescriptionFiles<Image extends File | undefined> = zodInfer<
  typeof payloadSchema
> & {
  image: Image;
  descriptionFiles: File[];
};

export type AddEventPayload = WithDescriptionFiles<File>;
export type EditEventPayload = WithDescriptionFiles<File | undefined>;
