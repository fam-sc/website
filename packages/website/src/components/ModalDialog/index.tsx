import { ReactElement, ReactNode } from 'react';

import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';
import { ModalOverlay } from '../ModalOverlay';

type ModalDialogProps = {
  title?: string;
  contentClassName?: string;
  footer?: ReactElement;
  onClose?: () => void;
  children: ReactNode;
};

export function ModalDialog({
  title,
  footer,
  children,
  contentClassName,
  onClose,
}: ModalDialogProps) {
  useScrollbar(false);

  return (
    <ModalOverlay className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          {title === undefined ? undefined : (
            <Typography variant="h5">{title}</Typography>
          )}

          <IconButton className={styles.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </ModalOverlay>
  );
}
