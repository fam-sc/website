import { ReactElement, ReactNode, useEffect } from 'react';

import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';

type ModalDialogProps = {
  title: string;
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
  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'auto';
    };
  });

  return (
    <div className={styles.root}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <Typography>{title}</Typography>

          <IconButton className={styles.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>

        <div className={styles.footer}>{footer}</div>
      </div>
    </div>
  );
}
