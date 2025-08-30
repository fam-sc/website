import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import { Typography, TypographyProps } from '../Typography';
import styles from './ColumnText.module.scss';

export interface ColumnTextProps extends TypographyProps, ComponentProps<'p'> {}

export function ColumnText({ className, ...rest }: ColumnTextProps) {
  return (
    <Typography className={classNames(styles.root, className)} {...rest} />
  );
}
