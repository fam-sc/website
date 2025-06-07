import { ImageSize } from '../types';

export function isJpeg(data: Uint8Array): boolean {
  return data[0] === 0xff && data[1] === 0xd8;
}

export function getSize(data: Uint8Array): ImageSize {
  let off = 0;

  while (off < data.length) {
    while (data[off] == 0xff) off++;
    const mrkr = data[off];
    off++;

    if (mrkr == 0xd8) continue; // SOI
    if (mrkr == 0xd9) break; // EOI
    if (0xd0 <= mrkr && mrkr <= 0xd7) continue;
    if (mrkr == 0x01) continue; // TEM

    const len = (data[off] << 8) | data[off + 1];
    off += 2;

    if (mrkr == 0xc0) {
      return {
        width: (data[off + 3] << 8) | data[off + 4],
        height: (data[off + 1] << 8) | data[off + 2],
      };
    }

    off += len - 2;
  }

  throw new Error('Invalid format');
}
