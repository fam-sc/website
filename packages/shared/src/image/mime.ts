import { isJpeg } from './formats/jpeg.js';
import { isPng } from './formats/png.js';
import { isWebp } from './formats/webp.js';

export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type ImageMimeType = `image/${ImageFormat}`;

export function getImageFormat(input: Uint8Array): ImageFormat {
  if (isJpeg(input)) {
    return 'jpeg';
  } else if (isPng(input)) {
    return 'png';
  } else if (isWebp(input)) {
    return 'webp';
  }

  throw new Error('Unknown image format');
}

export function getImageMimeType(input: Uint8Array): ImageMimeType {
  return `image/${getImageFormat(input)}`;
}
