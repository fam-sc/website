import { getSize as jpegGetSize, isJpeg } from './formats/jpeg.js';
import { getSize as pngGetSize, isPng } from './formats/png.js';
import { getSize as webpGetSize, isWebp } from './formats/webp.js';
import { ImageSize } from './types.js';

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
