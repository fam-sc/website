import { bufferToReadableStream } from '@shared/stream';
import sharp from 'sharp';

export async function resizeImage(
  _env: Env,
  content: Uint8Array,
  width: number,
  height: number
): Promise<ReadableStream<Uint8Array>> {
  const buffer = await sharp(content)
    .resize(width, height, { kernel: 'mitchell' })
    .png({ quality: 70 })
    .toBuffer();

  return bufferToReadableStream(buffer);
}
