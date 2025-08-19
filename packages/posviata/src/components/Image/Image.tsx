import { ComponentProps } from 'react';

import { resolveSizes } from '@/utils/image/sizes';
import { ImageInfo, ImageSizes } from '@/utils/image/types';

type ImgProps = ComponentProps<'img'>;

interface ImgPropsWithMultiple extends ImgProps {
  multiple?: ImageInfo[];
}

interface ImageWithSizesProps extends Omit<ImgProps, 'sizes' | 'loading'> {
  sizes?: string | ImageSizes;
}

interface ImageMultipleProps
  extends Omit<ImageWithSizesProps, 'src' | 'srcSet' | 'width' | 'height'> {
  multiple: ImageInfo[];
}

export type ImageProps = ImageWithSizesProps | ImageMultipleProps;

export function Image(props: ImageProps) {
  const imgProps = {
    ...props,
    sizes: resolveSizes(props.sizes),
    loading: 'lazy',
  } as ImgPropsWithMultiple;

  if ('multiple' in imgProps) {
    const { multiple } = imgProps;
    delete imgProps.multiple;

    if (multiple === undefined) {
      return null;
    }

    const lastImage = multiple.at(-1);

    if (lastImage === undefined) {
      return null;
    }

    const srcSet = multiple
      .map(({ src, width }) => `${src} ${width}w`)
      .join(',');

    imgProps.srcSet = srcSet;
    Object.assign(imgProps, lastImage);
  }

  return <img {...imgProps} />;
}
