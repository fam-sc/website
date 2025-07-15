export function bufferToReadableStream(
  buffer: Uint8Array
): ReadableStream<Uint8Array> {
  return new Blob([buffer]).stream();
}
