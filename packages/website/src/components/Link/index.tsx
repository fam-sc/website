import NextLink from 'next/link';

import { Typography } from '../Typography';

import styles from './index.module.scss';

import { PropsOf } from '@/types/react';
import { classNames } from '@/utils/classNames';

type AnchorProps = PropsOf<typeof NextLink>;

export interface LinkProps extends AnchorProps {
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
