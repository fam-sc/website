import { ComponentProps } from 'react';

import { classNames } from '@/utils/classNames';

import { Typography } from '../Typography';
import styles from './LinkButton.module.scss';

export type LinkButtonProps = ComponentProps<'a'>;

export function LinkButton({ className, ...rest }: LinkButtonProps) {
  return (
    <Typography
      as="a"
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
