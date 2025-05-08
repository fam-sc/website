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

export type Poll = {
  startDate: Date;
  endDate: Date | null;
  title: string;
  questions: PollQuestion[];
  respondents: PollRespondent[];
};

export type PollQuestion = {
  type: 'checkbox' | 'radio' | 'text';
  title: string;
  options?: PollQuestionOption[];
};

export type PollType = PollQuestion['type'];

export type PollQuestionOption = {
  title: string;
};

export type PollRespondent = {
  date: Date;
  answers: PollRespondentAnswer[];
};

export type PollRespondentAnswer = {
  // if question's type is input
  text?: string;

  // if question's type is radio.
  selectedIndex?: number;

  // if question's type is checkbox.
  selectedIndices?: number[];
};

export type Event = {
  title: string;
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
