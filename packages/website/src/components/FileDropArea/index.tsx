import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { UploadFileButton } from '../UploadFileButton';

export type FileDropAreaProps = {
  className?: string;
  accept?: string;
  onFile?: (file: File) => void;
};

export function FileDropArea({ onFile, accept, className }: FileDropAreaProps) {
  return (
    <BaseFileDropArea
      className={classNames(styles.root, className)}
      onFile={onFile}
    >
      <UploadFileButton accept={accept} onFile={onFile} />

      <Typography>Або перетяніть його</Typography>
    </BaseFileDropArea>
  );
}
