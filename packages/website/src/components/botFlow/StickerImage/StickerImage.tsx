import { classNames } from '@sc-fam/shared';

import { getMediaFileUrl } from '@/api/media';
import { Image, ImageProps } from '@/components/Image';

import styles from './StickerImage.module.scss';

type StickerImageProps = ImageProps & {
  stickerId: string;
};

export function StickerImage({
  stickerId,
  className,
  ...rest
}: StickerImageProps) {
  return (
    <Image
      className={classNames(className, styles.sticker)}
      src={getMediaFileUrl(`bot-flow/tg-sticker/${stickerId}`)}
      {...rest}
    />
  );
}
