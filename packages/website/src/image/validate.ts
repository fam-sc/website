import sharp from 'sharp';

export async function isValidImage(buffer: ArrayBuffer): Promise<boolean> {
  try {
    // It will force 'sharp' to read and validate whole image.
    await sharp(buffer).stats();

    return true;
  } catch {
    return false;
  }
}
