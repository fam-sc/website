import { RichTextString } from '@sc-fam/shared/richText';

import { ImageData } from './common';
import { Replace } from './utils';

export type RawGuide = {
  id: number;
  title: string;
  createdAtDate: number;
  updatedAtDate: number;
  description: string;
  slug: string;
  images: string | null;
};

export type Guide = Replace<
  RawGuide,
  {
    description: RichTextString;
    images: ImageData | null;
  }
>;
