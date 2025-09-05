import { IconButton, useNotification } from '@sc-fam/shared-ui';
import { useCallback } from 'react';

import { CopyIcon } from '@/icons/Copy';

export interface CopyButtonProps {
  className?: string;
  input: string;
}

export function CopyButton({ className, input }: CopyButtonProps) {
  const notification = useNotification();

  const onClick = useCallback(() => {
    navigator.clipboard
      .writeText(input)
      .then(() => {
        notification.show('Текст скопійовано', 'plain');
      })
      .catch(() => {
        notification.show('Сталася помилка', 'error');
      });
  }, [input, notification]);

  return (
    <IconButton
      title="Скопіювати"
      className={className}
      onClick={onClick}
      hover="fill"
    >
      <CopyIcon />
    </IconButton>
  );
}
