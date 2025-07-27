import { ImageSize } from '@sc-fam/shared/image';
import { RichTextString } from '@sc-fam/shared/richText';

export type RawGuide = {
  id: number;
  title: string;
  createdAtDate: number;
  updatedAtDate: number;
  description: string;
  images: string | null;
};

export type Guide = Omit<RawGuide, 'description' | 'images'> & {
  description: RichTextString;
  images: ImageSize[] | null;
};
