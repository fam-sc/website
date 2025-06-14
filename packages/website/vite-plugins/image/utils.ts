import { ImageSize } from '@shared/image/types';
import sharp, {
  FormatEnum,
  Sharp,
  PngOptions,
  JpegOptions,
  WebpOptions,
} from 'sharp';

export interface MetaEntry extends ImageSize {
  format: keyof FormatEnum;
}

const breakpoints = [300, 600, 900, 1200, 1536];

export function resolveImageSizes(nativeWidth: number): number[] {
  const result = breakpoints.filter((width) => width < nativeWidth);
  if (result.at(-1) !== nativeWidth) {
    result.push(nativeWidth);
  }

  return result;
}

export function getTargetSize(meta: MetaEntry, width: number): ImageSize {
  return {
    width: width,
    height: Math.round(width * (meta.height / meta.width)),
  };
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

export function outputFormat(
  sharp: Sharp,
  format: keyof FormatEnum,
  options: PngOptions & JpegOptions & WebpOptions
): Sharp {
  switch (format) {
    case 'png': {
      return sharp.png(options);
    }
    case 'jpeg': {
      return sharp.jpeg(options);
    }
    case 'webp': {
      return sharp.webp(options);
    }
    default: {
      throw new Error('Unknown format');
    }
  }
}

export async function getFileMetadata(filePath: string) {
  const { width, height, format } = await sharp(filePath).metadata();

  if (width === undefined || height === undefined || format === undefined) {
    throw new Error('Invalid size or no format');
  }

  return { width, height, format };
}

export function resizeImage(
  filePath: string,
  size: ImageSize,
  format: keyof FormatEnum
): Promise<Buffer> {
  return outputFormat(
    sharp(filePath).resize(size.width, size.height, { kernel: 'mitchell' }),
    format,
    {
      quality: 70,
    }
  ).toBuffer();
}
