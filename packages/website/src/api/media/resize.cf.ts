import { bufferToReadableStream } from '@shared/stream';

export async function resizeImage(
  env: Env,
  content: Uint8Array,
  width: number,
  height: number
): Promise<ReadableStream<Uint8Array>> {
  const result = await env.IMAGES.input(bufferToReadableStream(content))
    .transform({ width, height })
    .output({ format: 'image/png', quality: 70 });

  return result.image();
}
