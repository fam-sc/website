import { ObjectId } from 'mongodb';

import { RichTextString } from '@shared/richText/types';
import { UserRole } from './user';

export type Event = {
  title: string;
  status: 'pending' | 'ended';
  date: Date;
  description: RichTextString;
  image?: ImageInfo;
};

export type GalleryImage = {
  date: Date;
  order: number;
  eventId: string | null;
  image?: ImageInfo;
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

export type ImageInfo = {
  width: number;
  height: number;
};
