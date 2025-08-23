import { ImageSize } from '@sc-fam/shared/image';

export type ImageSizes = Record<number | 'default', `${string | number}vw`>;

export interface ImageInfo extends ImageSize {
  src: string;
}
