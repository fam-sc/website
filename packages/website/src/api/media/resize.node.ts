import { bufferToReadableStream } from '@sc-fam/shared';
import { ImageFormat } from '@sc-fam/shared/image';
import sharp from 'sharp';

export async function resizeImage(
  _env: Env,
  content: Uint8Array,
  width: number,
  height: number,
  format: ImageFormat
): Promise<ReadableStream<Uint8Array>> {
  const buffer = await sharp(content)
    .resize(width, height, { kernel: 'mitchell' })
    [format]({ quality: 70 })
    .toBuffer();

  return bufferToReadableStream(buffer);
}
