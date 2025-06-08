import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export type TextWithImageProps = {
  className?: string;
  title: string;
  subtext: string;
  image:
    | string
    | {
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
  className,
  title,
  subtext,
  image,
  button,
}: TextWithImageProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles['image-wrapper']}>
        {typeof image === 'string' ? (
          <img src={image} />
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
          />
        )}
      </div>

      <div className={styles['text-section']}>
        <Typography variant="h4">{title}</Typography>
        <Typography>{subtext}</Typography>
        {button === undefined ? undefined : (
          <LinkButton to={button.href} buttonVariant="solid" color="primary">
            {button.title}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
