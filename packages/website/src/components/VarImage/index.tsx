import { Image, ImageProps } from '../Image';
import { ImageInfo, ImageSizes } from '@/utils/image/types';

type ImgProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export type VarImageType =
  | string
  | ImageInfo
  | ImageInfo[]
  | { images: ImageInfo[]; sizes: ImageSizes };

export interface VarImageProps extends ImgProps {
  image: VarImageType;
}

export function VarImage({ image, ...rest }: VarImageProps) {
  const imageProps =
    typeof image === 'string'
      ? { src: image }
      : Array.isArray(image)
        ? { multiple: image }
        : 'images' in image
          ? { multiple: image.images, sizes: image.sizes }
          : image;
  Object.assign(imageProps, rest);

  return <Image {...imageProps} />;
}
