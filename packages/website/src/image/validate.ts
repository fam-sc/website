import sharp, { SharpInput } from 'sharp';

export async function isValidImage(input: SharpInput): Promise<boolean> {
  try {
    // It will force 'sharp' to read and validate whole image.
    await sharp(input).stats();

    return true;
  } catch {
    return false;
  }
}
