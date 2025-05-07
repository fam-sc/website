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
};

export type Poll = {
  startDate: Date;
  endDate: Date;
  title: string;
  questions: PollQuestion[];
};

export type PollQuestion = {
  text: string;
} & ({ type: 'options'; options: PollQuestionOption } | { type: 'input' });

export type PollType = PollQuestion['type'];

export type PollQuestionOption = {
  text: string;
};

export type PollRespondent = {
  userId: string;
  startDate: Date;
  endDate: Date;
  answers: PollRespondentAnswer[];
};

export type PollRespondentAnswer = {
  questionId: string;
  // if question's type is input
  text?: string;

  // if questions's type is options.
  optionId: string;
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
