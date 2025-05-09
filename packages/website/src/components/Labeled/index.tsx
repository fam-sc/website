import { ReactNode } from 'react';
import styles from './index.module.scss';
import { Typography } from '../Typography';
import { PropsMap } from '@/types/react';

type DivProps = PropsMap['div'];

export interface LabeledProps extends DivProps {
  title: string;
  children: ReactNode;
}

export function Labeled({ title, children, ...rest }: LabeledProps) {
  return (
    <div {...rest}>
      <Typography className={styles.title}>{title}</Typography>
      {children}
    </div>
  );
}
