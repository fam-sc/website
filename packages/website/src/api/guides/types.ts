import { infer as zodInfer } from 'zod/v4-mini';

import type { payloadSchema } from './payloads';
export type { EventStatus } from '@sc-fam/data';

type BasePayload = zodInfer<typeof payloadSchema> & {
  image: File | undefined;
  descriptionFiles: File[];
};

export type AddGuidePayload = BasePayload;
export type EditGuidePayload = BasePayload;
