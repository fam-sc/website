import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { FileGate } from '@/utils/fileGate';

export type FileDropAreaProps = {
  className?: string;
  accept?: FileGate;
  onFiles?: (files: FileList) => void;
};

export function FileDropArea({
  onFiles,
  accept,
  className,
}: FileDropAreaProps) {
  return (
    <BaseFileDropArea
      className={classNames(styles.root, className)}
      onFiles={onFiles}
      accept={accept}
    />
  );
}
