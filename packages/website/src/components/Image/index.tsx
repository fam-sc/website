import { PropsMap } from '@/types/react';
import { resolveSizes } from '@/utils/image/sizes';
import { ImageInfo, ImageSizes } from '@/utils/image/types';

type ImgProps = PropsMap['img'];

interface ImageWithSizesProps extends Omit<ImgProps, 'sizes'> {
  sizes?: string | ImageSizes;
}

interface ImageMultipleProps
  extends Omit<ImageWithSizesProps, 'src' | 'srcSet' | 'width' | 'height'> {
  multiple: ImageInfo[];
}

export type ImageProps = ImageWithSizesProps | ImageMultipleProps;

export function Image(props: ImageProps) {
  let imgProps = { ...props, sizes: resolveSizes(props.sizes) };
  if ('multiple' in props) {
    const { multiple } = props;
    const lastImage = multiple.at(-1);
    if (lastImage === undefined) {
      return null;
    }

    const srcSet = multiple
      .map(({ src, width }) => `${src} ${width}w`)
      .join(',');

    imgProps = { srcSet, ...lastImage, ...imgProps };
  }

  return <img {...imgProps} />;
}
