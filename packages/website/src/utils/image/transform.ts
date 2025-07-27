import { ImageSize } from '@sc-fam/shared/image';

import { getMediaFileUrl } from '@/api/media';
import { MediaSubPathWithImageSize } from '@/api/media/types';

import { ImageInfo } from './types';

export function sizesToImages(
  prefix: MediaSubPathWithImageSize,
  sizes: ImageSize[]
): ImageInfo[] {
  return sizes.map(({ width, height }) => ({
    src: getMediaFileUrl(`${prefix}/${width}.png`),
    width,
    height,
  }));
}
