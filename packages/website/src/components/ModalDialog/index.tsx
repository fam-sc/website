import { ReactElement, ReactNode } from 'react';

import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';

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
    <div className={styles.root}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          {title === undefined ? undefined : <Typography>{title}</Typography>}

          <IconButton className={styles.close} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
