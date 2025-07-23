import { ReactNode } from 'react';

import { PropsMap } from '@/types/react';

import { Typography, TypographyVariant } from '../Typography';
import styles from './Labeled.module.scss';

type DivProps = PropsMap['div'];

export interface LabeledProps extends DivProps {
  title: string;
  titleVariant?: TypographyVariant;
  children: ReactNode;
}

export function Labeled({
  title,
  titleVariant,
  children,
  ...rest
}: LabeledProps) {
  return (
    <div {...rest}>
      <Typography className={styles.title} variant={titleVariant}>
        {title}
      </Typography>
      {children}
    </div>
  );
}
