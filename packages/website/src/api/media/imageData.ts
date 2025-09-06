import { ImageData } from '@sc-fam/data';
import {
  getImageFormat,
  getImageSize,
  resolveImageSizes,
} from '@sc-fam/shared/image';

export function resolveImageData(input: Uint8Array): ImageData {
  const format = getImageFormat(input);

  return { format, sizes: resolveImageSizes(getImageSize(input)) };
}
