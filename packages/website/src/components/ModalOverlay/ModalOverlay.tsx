import { classNames } from '@sc-fam/shared';
import { ReactNode } from 'react';

import { useScrollbar } from '@/hooks/useScrollbar';

import styles from './ModalOverlay.module.scss';

export type ModalOverlayEffect = 'tint' | 'blur';

export interface ModalOverlayProps {
  className?: string;
  effect?: ModalOverlayEffect;
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
