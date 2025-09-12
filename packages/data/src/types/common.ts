import { ImageFormat, ImageSize } from '@sc-fam/shared/image';
import { RichTextString } from '@sc-fam/shared/richText';

import { UserRole } from './user';
import { Replace } from './utils';

export type ImageData = { format: ImageFormat; sizes: ImageSize[] };

export enum EventStatus {
  PENDING = 0,
  ENDED = 1,
}

export type RawEvent = {
  id: number;
  title: string;
  status: EventStatus;
  date: number;
  description: string;
  slug: string;
  images: string;
};

export type Event = Replace<
  RawEvent,
  {
    description: RichTextString;
    images: ImageData;
  }
>;

export type RawGalleryImage = {
  id: number;
  date: number;
  order: number;
  eventId: number | null;
  images: string;
};

export type GalleryImage = Replace<
  RawGalleryImage,
  {
    images: ImageData;
  }
>;

export type GalleryImageWithEvent = {
  id: number;
  date: number;
  event: {
    id: number;
    title: string;
  } | null;
};

export type AuthSession = {
  sessionId: string;
  userId: number;
};

export type AuthSessionWithRole = {
  sessionId: bigint;
  userId: string;
  role: UserRole;
};

export type Group = {
  name: string;
  campusId: string;
};
