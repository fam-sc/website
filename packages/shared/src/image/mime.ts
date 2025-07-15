import { isJpeg } from './formats/jpeg';
import { isPng } from './formats/png';
import { isWebp } from './formats/webp';

type ImageFormat = 'jpeg' | 'png' | 'webp';
export type ImageMimeType = `image/${ImageFormat}`;

export function getImageMimeType(input: Uint8Array): ImageMimeType {
  if (isJpeg(input)) {
    return 'image/jpeg';
  } else if (isPng(input)) {
    return 'image/png';
  } else if (isWebp(input)) {
    return 'image/webp';
  }

  throw new Error('Unknown image format');
}
