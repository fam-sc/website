import { ImageSize } from './types';

const breakpoints = [300, 600, 900, 1200, 1536];

export function resolveImageWidths(nativeWidth: number): number[] {
  const result = breakpoints.filter((width) => width < nativeWidth);
  if (result.at(-1) !== nativeWidth) {
    result.push(nativeWidth);
  }

  return result;
}

export function resolveImageSizes(nativeSize: ImageSize): ImageSize[] {
  return resolveImageWidths(nativeSize.width).map((width) =>
    getTargetSize(nativeSize, width)
  );
}

export function getTargetSize(
  current: ImageSize,
  targetWidth: number
): ImageSize {
  return {
    width: targetWidth,
    height: Math.round(targetWidth * (current.height / current.width)),
  };
}
