import sharp, {
  Sharp,
  FormatEnum,
  PngOptions,
  JpegOptions,
  WebpOptions,
  SharpInput,
} from 'sharp';
import { ImageSize } from './types';

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

export function resizeImage(
  input: SharpInput,
  size: ImageSize,
  format: keyof FormatEnum
): Promise<Buffer> {
  return outputFormat(
    sharp(input).resize(size.width, size.height, { kernel: 'lanczos3' }),
    format,
    {
      quality: 70,
    }
  ).toBuffer();
}
