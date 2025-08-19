import { ImageSize } from '@sc-fam/shared/image';
import { FormatEnum } from 'sharp';

export interface MetaEntry extends ImageSize {
  format: keyof FormatEnum;
}

export function withWidth(url: string, width: number): string {
  const dotIndex = url.lastIndexOf('.');
  if (dotIndex === -1) {
    throw new Error('No extension');
  }

  const namePart = url.slice(0, dotIndex);
  const extension = url.slice(dotIndex + 1);

  return `${namePart}-${width}.${extension}`;
}
