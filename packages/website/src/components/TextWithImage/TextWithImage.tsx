import { classNames } from '@sc-fam/shared';

import { LinkButton } from '../LinkButton';
import { Typography } from '../Typography';
import { VarImage, VarImageType } from '../VarImage';
import styles from './TextWithImage.module.scss';

export type TextWithImageProps = {
  className?: string;
  title: string;
  subtext: string;
  image: VarImageType;
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
        <VarImage image={image} sizes={{ 900: '60vw', default: '100vw' }} />
      </div>

      <div className={styles['text-section']}>
        <Typography variant="h4">{title}</Typography>
        <Typography>{subtext}</Typography>
        {button && (
          <LinkButton to={button.href} buttonVariant="solid" color="primary">
            {button.title}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
