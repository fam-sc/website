import { ImageSize } from './types';

export function nearestSize(
  sizes: ImageSize[],
  targetWidth: number
): ImageSize {
  let minDist = Number.MAX_VALUE;
  let minSize: ImageSize | undefined;

  for (const size of sizes) {
    const dist = Math.abs(size.width - targetWidth);

    if (dist < minDist) {
      minDist = dist;
      minSize = size;
    }
  }

  if (minSize === undefined) {
    throw new Error('Array is empty');
  }

  return minSize;
}
