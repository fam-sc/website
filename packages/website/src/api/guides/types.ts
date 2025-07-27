import { infer as zodInfer } from 'zod/v4-mini';

import type { payloadSchema } from './payloads';
export type { EventStatus } from '@sc-fam/data';

export type WithDescriptionFiles<Image extends File | undefined> = zodInfer<
  typeof payloadSchema
> & {
  image: Image;
  descriptionFiles: File[];
};

export type AddGuidePayload = WithDescriptionFiles<File>;
export type EditGuidePayload = WithDescriptionFiles<File | undefined>;
