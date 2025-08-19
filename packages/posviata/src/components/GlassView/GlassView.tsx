import { ReactNode } from 'react';

import { classNames } from '@/utils/classNames';

import styles from './GlassView.module.scss';

export interface GlassViewProps {
  className?: string;
  children: ReactNode;
}

export function GlassView({ className, children }: GlassViewProps) {
  return <div className={classNames(styles.root, className)}>{children}</div>;
}
