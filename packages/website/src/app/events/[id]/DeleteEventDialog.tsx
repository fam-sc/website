import { useCallback } from 'react';

import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { Typography } from '@/components/Typography';

export type DeleteEventDialogProps = {
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteEventDialog({
  onClose,
  onDelete,
}: DeleteEventDialogProps) {
  const onCloseAndDelete = useCallback(() => {
    onClose();
    onDelete();
  }, [onClose, onDelete]);

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Ні</Button>
          <Button onClick={onCloseAndDelete} buttonVariant="solid">
            Так
          </Button>
        </>
      }
    >
      <Typography>Ви справді хочете видалити подію?</Typography>
    </ModalDialog>
  );
}
