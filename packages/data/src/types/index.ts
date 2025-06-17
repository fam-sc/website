import { ObjectId } from 'mongodb';

import { RichTextString } from '@shared/richText/types';
import { ImageSize } from '@shared/image/types';
import { UserRole } from './user';

export type EventStatus = 'pending' | 'ended';

export type Event = {
  title: string;
  status: 'pending' | 'ended';
  date: Date;
  description: RichTextString;
  images: ImageSize[];
};

export type GalleryImage = {
  date: Date;
  order: number;
  eventId: string | null;
  images: ImageSize[];
};

export type AuthSession = {
  sessionId: bigint;
  userId: ObjectId;
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
