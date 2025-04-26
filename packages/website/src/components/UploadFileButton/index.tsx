import { PropsMap } from '@/types/react';
import { Button, ButtonProps } from '../Button';

import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';

type LabelProps = PropsMap['label'];

export type UploadFileButtonProps = ButtonProps &
  LabelProps & {
    accept?: string;
    disabled?: boolean;
    onFile?: (file: File) => void;
  };

export function UploadFileButton({
  onFile,
  accept,
  disabled,
  className,
  ...rest
}: UploadFileButtonProps) {
  return (
    <Button as="label" className={classNames(styles.root, className)} {...rest}>
      <input
        type="file"
        disabled={disabled}
        accept={accept}
        onChange={(event) => {
          const { files } = event.target;

          if (files !== null && files.length > 0) {
            onFile?.(files[0]);
          }
        }}
      />
      Виберіть файл
    </Button>
  );
}
