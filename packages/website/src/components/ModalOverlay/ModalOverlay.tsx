import { ReactNode } from 'react';

import { useScrollbar } from '@/hooks/useScrollbar';
import { classNames } from '@/utils/classNames';

import styles from './ModalOverlay.module.scss';

export interface ModalOverlayProps {
  className?: string;
  effect?: 'tint' | 'blur';
  children?: ReactNode;
}

export function ModalOverlay({
  className,
  effect,
  children,
}: ModalOverlayProps) {
  useScrollbar(false);

  return (
    <div
      className={classNames(
        styles.root,
        styles[`root-effect-${effect}`],
        className
      )}
    >
      {children}
    </div>
  );
}
