import NextLink from 'next/link';

import { Typography, TypographyProps } from '../Typography';

import styles from './index.module.scss';

import { WithDataSpace } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { ComponentProps } from 'react';

type AnchorProps = ComponentProps<typeof NextLink>;

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
      as={NextLink}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
