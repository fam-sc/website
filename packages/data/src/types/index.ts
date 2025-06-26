import { RichTextString } from '@shared/richText/types';
import { ImageSize } from '@shared/image/types';
import { UserRole } from './user';

export const enum EventStatus {
  PENDING = 0,
  ENDED = 1,
}

export type RawEvent = {
  id: number;
  title: string;
  status: EventStatus;
  date: number;
  description: string;
  images: string;
};

export type Event = Omit<RawEvent, 'description' | 'images'> & {
  description: RichTextString;
  images: ImageSize[];
};

export type RawGalleryImage = {
  id: number;
  date: number;
  order: number;
  eventId: number | null;
  images: string;
};

export type GalleryImage = {
  id: number;
  date: number;
  order: number;
  eventId: number | null;
  images: ImageSize[];
};

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
  campusId: string;
  name: string;
};
