import { Size } from '../types';

function get16Bit(buffer: Uint8Array, offset: number): number {
  return buffer[offset] | (buffer[offset + 1] << 8);
}

function get24Bit(buffer: Uint8Array, offset: number): number {
  return (
    buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 1] << 16)
  );
}

export function isWebp(buffer: Uint8Array): boolean {
  return (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46
  );
}

export function getSize(buffer: Uint8Array): Size {
  if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] == 0x38) {
    switch (buffer[15]) {
      case 0x20: {
        return {
          width: get16Bit(buffer, 26) & 0x3f_ff,
          height: get16Bit(buffer, 28) & 0x3f_ff,
        };
      }
      case 0x58: {
        return {
          width: 1 + get24Bit(buffer, 24),
          height: 1 + get24Bit(buffer, 27),
        };
      }
      case 0x4c: {
        const firstBytes = get16Bit(buffer, 21);
        const lastTwoDigits = (firstBytes & 0xc0_00) << 14;

        return {
          width: 1 + (firstBytes & 0x3f_ff),
          height: 1 + ((get16Bit(buffer, 23) & (0xf_ff << 2)) | lastTwoDigits),
        };
      }
    }
  }

  throw new Error('Invalid format');
}
