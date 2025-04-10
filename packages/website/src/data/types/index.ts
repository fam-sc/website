import { RichTextString } from '../../richText/types';

export type UserRole = 'student' | 'sc' | 'admin';

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  parentName: string | null;
  academicGroup: string;
  academicCourse: number;
  email: string | null;
  telnum: string | null;
  photoId: string;
  role: UserRole;
  username: string;
  passwordHash: string;
};

export type Poll = {
  _id: string;
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
  _id: string;
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
  _id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: RichTextString;
  conclusion: EventConclusion | null;
};

export type EventConclusion = {
  text: RichTextString;
};

export type GalleryImage = {
  _id: string;
  remoteId: string;
  date: Date;
  eventId: string | null;
  userId: string | null;
};

export type UsefulLink = {
  _id: string;
  href: string;
  title: string;
  imageId: string | null;
};
