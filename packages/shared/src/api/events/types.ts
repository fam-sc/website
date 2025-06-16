import { ImageSize } from '../../image/types';
import { RichTextString } from '../../richText/types';

export type EventStatus = 'pending' | 'ended';

export type Event = {
  id: string;
  status: 'pending' | 'ended';
  title: string;
  date: string;
  description: RichTextString;
  images?: ImageSize[];
};
