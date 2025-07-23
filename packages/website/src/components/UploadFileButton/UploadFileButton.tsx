import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { Button, ButtonProps } from '../Button';
import styles from './UploadFileButton.module.scss';

type LabelProps = PropsMap['label'];

export type UploadFileButtonProps = ButtonProps &
  LabelProps & {
    accept?: string;
    disabled?: boolean;
    text?: string;
    onFiles?: (files: FileList) => void;
  };

export function UploadFileButton({
  onFiles,
  accept,
  disabled,
  className,
  text,
  ...rest
}: UploadFileButtonProps) {
  return (
    <Button
      as="label"
      className={classNames(styles.root, className)}
      role="button"
      disabled={disabled}
      {...rest}
    >
      <input
        type="file"
        disabled={disabled}
        accept={accept}
        onChange={(event) => {
          const { files } = event.target;

          if (files !== null) {
            onFiles?.(files);
          }
        }}
      />
      {text ?? 'Виберіть файл'}
    </Button>
  );
}
