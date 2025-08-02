/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { bufferToReadableStream } from '@sc-fam/shared';

export async function resizeImage(
  _env: Env,
  content: Uint8Array,
  _width: number,
  _height: number
): Promise<ReadableStream<Uint8Array>> {
  return bufferToReadableStream(content);
}
