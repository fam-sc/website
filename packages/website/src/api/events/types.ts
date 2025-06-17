import { EventStatus } from '@data/types';
import { ImageSize } from '@shared/image/types';
import { RichTextString } from '@shared/richText/types';
export type { EventStatus } from '@data/types';

export type ShortEvent = {
  id: string;
  title: string;
};

export type Event = {
  id: string;
  title: string;
  status: EventStatus;
  date: string;
  description: RichTextString;
  images: ImageSize[];
};
