import { ImageData } from '@sc-fam/data';

import { getMediaFileUrl } from '@/api/media';
import { MediaSubPathWithImageSize } from '@/api/media/types';

import { ImageInfo } from './types';

export function imageDataToClientImages(
  prefix: MediaSubPathWithImageSize,
  data: ImageData
): ImageInfo[] {
  return data.sizes.map(({ width, height }) => ({
    src: getMediaFileUrl(`${prefix}/${width}.${data.format}`),
    width,
    height,
  }));
}
