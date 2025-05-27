import { ReactNode } from 'react';
import styles from './index.module.scss';
import { Typography, TypographyVariant } from '../Typography';
import { PropsMap } from '@/types/react';

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
