import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Typography, TypographyProps } from '../Typography';
import styles from './index.module.scss';

type ParagraphProps = PropsMap['p'];

export interface ColumnTextProps extends TypographyProps, ParagraphProps {}

export function ColumnText({ className, ...rest }: ColumnTextProps) {
  return (
    <Typography className={classNames(styles.root, className)} {...rest} />
  );
}
