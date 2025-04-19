import { Typography, TypographyProps } from '../Typography';

import styles from './index.module.scss';

import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

type ParagraphProps = PropsMap['p'];

export interface ColumnTextProps extends TypographyProps, ParagraphProps {}

export function ColumnText({ className, ...rest }: ColumnTextProps) {
  return (
    <Typography className={classNames(styles.root, className)} {...rest} />
  );
}
