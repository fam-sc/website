import { ImageSize } from '@shared/image/types';

export type ImageSizes = Record<number | 'default', `${number}vw`>;

export interface ImageInfo extends ImageSize {
  src: string;
}
