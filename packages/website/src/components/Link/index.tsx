import { Link as RouterLink } from 'react-router';

import { Typography, TypographyProps } from '../Typography';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { ComponentProps } from 'react';

type AnchorProps = ComponentProps<typeof RouterLink>;

export interface LinkProps
  extends TypographyProps,
    AnchorProps,
    WithDataSpace<'link-variant'> {
  linkVariant?: 'clean' | 'underline';
}

export function Link({ linkVariant, className, ...rest }: LinkProps) {
  return (
    <Typography
      data-link-variant={linkVariant}
      as={RouterLink}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
