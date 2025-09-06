import { bufferToReadableStream } from '@sc-fam/shared';
import { ImageFormat } from '@sc-fam/shared/image';

export async function resizeImage(
  env: Env,
  content: Uint8Array,
  width: number,
  height: number,
  format: ImageFormat
): Promise<ReadableStream<Uint8Array>> {
  const result = await env.IMAGES.input(bufferToReadableStream(content))
    .transform({ width, height })
    .output({ format: `image/${format}`, quality: 70 });

  return result.image();
}
