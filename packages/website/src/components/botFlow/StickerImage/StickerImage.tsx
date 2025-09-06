import { classNames } from '@sc-fam/shared';

import { StickerSource } from '@/api/botFlow/types';
import { getMediaFileUrl } from '@/api/media';
import { Image, ImageProps } from '@/components/Image';

import styles from './StickerImage.module.scss';

type StickerImageProps = ImageProps & {
  source: StickerSource;
};

export function StickerImage({
  source,
  className,
  ...rest
}: StickerImageProps) {
  return (
    <Image
      className={classNames(className, styles.sticker)}
      src={getMediaFileUrl(source)}
      {...rest}
    />
  );
}
