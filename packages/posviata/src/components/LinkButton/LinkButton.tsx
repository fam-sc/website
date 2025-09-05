import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';
import { Link } from 'react-router';

import { Typography } from '../Typography';
import styles from './LinkButton.module.scss';

export type LinkButtonProps = ComponentProps<typeof Link>;

export function LinkButton({ className, ...rest }: LinkButtonProps) {
  return (
    <Typography
      as={Link}
      className={classNames(styles.root, className)}
      {...rest}
    />
  );
}
