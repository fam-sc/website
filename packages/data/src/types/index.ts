import { ObjectId } from 'mongodb';

import { RichTextString } from '@shared/richText/types';

export type UserRole = 'student' | 'group-head' | 'admin';

export type User = {
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  email: string;
  telnum: string | null;
  photoId: string | null;
  role: UserRole;
  passwordHash: Uint8Array;
  telegramUserId: number | null;
};

export type Event = {
  title: string;
  status: 'pending' | 'ended';
  date: Date;
  description: RichTextString;
};

export type GalleryImage = {
  date: Date;
  order: number;
  eventId: string | null;
};

export type UsefulLink = {
  href: string;
  title: string;
  imageId: string | null;
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
