import { ImageData } from '@sc-fam/data';

export type GalleryImageWithEvent = {
  id: number;
  date: string;
  event: {
    id: number;
    title: string;
  } | null;
};

export type GalleryImageWithSizes = {
  id: number;
  imageData: ImageData;
};
