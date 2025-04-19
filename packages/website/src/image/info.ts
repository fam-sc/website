import { getImageSize, Size } from './size';

export interface ImageInfo extends Size {
  src: string;
  alt: string;
}

export async function readPublicImageInfo(url: string): Promise<ImageInfo> {
  const size = await getImageSize(`./public/${url}`);

  return {
    src: url,
    alt: '',
    ...size,
  };
}
