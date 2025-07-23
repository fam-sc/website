import { classNames } from '@/utils/classNames';
import { FileGate } from '@/utils/fileGate';

import { BaseFileDropArea } from '../BaseFileDropArea';
import styles from './FileDropArea.module.scss';

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
