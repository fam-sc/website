import { useCallback } from 'react';

import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { Typography } from '@/components/Typography';

export type ConfirmationDialogProps = {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  onDecline?: () => void;
};

export function ConfirmationDialog({
  title,
  onClose,
  onConfirm,
  onDecline,
}: ConfirmationDialogProps) {
  const onConfirmAndClose = useCallback(() => {
    onClose();
    onConfirm?.();
  }, [onClose, onConfirm]);

  const onDeclineAndClose = useCallback(() => {
    onClose();
    onDecline?.();
  }, [onClose, onDecline]);

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <>
          <Button onClick={onDeclineAndClose}>Ні</Button>
          <Button onClick={onConfirmAndClose} buttonVariant="solid">
            Так
          </Button>
        </>
      }
    >
      <Typography>{title}</Typography>
    </ModalDialog>
  );
}
