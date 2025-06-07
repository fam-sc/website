import { Size } from '../types';

function readUint32BigEndian(buffer: Uint8Array, offset: number): number {
  return (
    (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3]
  );
}

export function isPng(buffer: Uint8Array): boolean {
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

export function getSize(buffer: Uint8Array): Size {
  const width = readUint32BigEndian(buffer, 0x10);
  const height = readUint32BigEndian(buffer, 0x14);

  return { width, height };
}
