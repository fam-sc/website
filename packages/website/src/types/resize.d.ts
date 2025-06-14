declare module 'virtual:api/media/resize' {
  export async function resizeImage(
    env: Env,
    content: Uint8Array,
    width: number,
    height: number
  ): Promise<ReadableStream<Uint8Array>>;
}
