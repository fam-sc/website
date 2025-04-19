import sharp from 'sharp';

export interface Size {
  width: number;
  height: number;
}

export async function getImageSize(filePath: string): Promise<Size> {
  const { width, height } = await sharp(filePath).metadata();

  if (width === undefined || height === undefined) {
    throw new Error('Width or height are undefined');
  }

  return { width, height };
}
