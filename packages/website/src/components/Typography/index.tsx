import { JSX } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type ParagraphProps = JSX.IntrinsicElements['p'];

export type TypographyProps = ParagraphProps;

export function Typography({ className, ...rest }: TypographyProps) {
  return <p className={classNames(styles.root, className)} {...rest} />;
}
