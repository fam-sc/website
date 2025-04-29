import sharp, { SharpInput } from 'sharp';

export interface Size {
  width: number;
  height: number;
}

export async function getImageSize(input: SharpInput): Promise<Size> {
  const { width, height } = await sharp(input).metadata();

  if (width === undefined || height === undefined) {
    throw new Error('Width or height are undefined');
  }

  return { width, height };
}
