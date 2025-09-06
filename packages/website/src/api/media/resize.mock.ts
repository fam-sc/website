/* eslint-disable @typescript-eslint/require-await */
import { bufferToReadableStream } from '@sc-fam/shared';

export async function resizeImage(
  _env: Env,
  content: Uint8Array
): Promise<ReadableStream<Uint8Array>> {
  return bufferToReadableStream(content);
}
