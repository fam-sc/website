import { getSize as jpegGetSize, isJpeg } from './formats/jpeg';
import { getSize as pngGetSize, isPng } from './formats/png';
import { getSize as webpGetSize, isWebp } from './formats/webp';
import { ImageSize } from './types';

export function getImageSize(input: Uint8Array): ImageSize {
  if (isJpeg(input)) {
    return jpegGetSize(input);
  } else if (isPng(input)) {
    return pngGetSize(input);
  } else if (isWebp(input)) {
    return webpGetSize(input);
  }

  throw new Error('Unknown format');
}
