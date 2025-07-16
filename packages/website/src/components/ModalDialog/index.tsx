import { ReactElement, ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';

import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';

import { IconButton } from '../IconButton';
import { ModalOverlay } from '../ModalOverlay';
import { Typography } from '../Typography';
import styles from './index.module.scss';

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
  const titleId = useId();

  useScrollbar(false);

  return createPortal(
    <ModalOverlay className={styles.overlay} effect="tint">
      <div className={styles.dialog} role="dialog" aria-labelledby={titleId}>
        <div className={styles.header}>
          {title === undefined ? undefined : (
            <Typography variant="h5" id={titleId}>
              {title}
            </Typography>
          )}

          <IconButton
            className={styles.close}
            onClick={onClose}
            title="Закрити діалог"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </ModalOverlay>,
    document.body
  );
}
