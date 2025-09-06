declare module 'virtual:api/media/resize' {
  export async function resizeImage(
    env: Env,
    content: Uint8Array,
    width: number,
    height: number,
    format: import('@sc-fam/shared/image').ImageFormat
  ): Promise<ReadableStream<Uint8Array>>;
}
