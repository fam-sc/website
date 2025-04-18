import Image from 'next/image';

import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';

import styles from './index.module.scss';

export type TextWithImageProps = {
  title: string;
  subtext: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  button?: {
    title: string;
    href: string;
  };
};

export function TextWithImage({
  title,
  subtext,
  image,
  button,
}: TextWithImageProps) {
  return (
    <div className={styles.root}>
      <div className={styles['image-wrapper']}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
        />
      </div>

      <div className={styles['text-section']}>
        <Typography variant="h4">{title}</Typography>
        <Typography>{subtext}</Typography>
        {button === undefined ? undefined : (
          <LinkButton href={button.href} variant="solid" color="primary">
            {button.title}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
