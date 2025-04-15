import { useState } from 'react';

import { CircularProgress } from '../CircularProgress';
import { FileDropArea } from '../FileDropArea';
import { ModalDialog } from '../ModalDialog';

import styles from './index.module.scss';

export type FileUploadDialogProps = {
  // A number between 0 and 1 that specifies
  // how much of the sumbitted file is uploaded to the media server.
  fileUploadProgress?: number;

  // It only works on the file chooser. User can still select a file different than 'accept' via file drop.
  // The logic shouldn't rely on it. Just a hint.
  accept?: string;

  onSubmit?: (file: File) => void;
  onClose?: () => void;
};

export function FileUploadDialog({
  fileUploadProgress,
  accept,
  onSubmit,
  onClose,
}: FileUploadDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ModalDialog
      title="Завантажте файл"
      contentClassName={styles.content}
      onClose={onClose}
    >
      {isLoading && fileUploadProgress !== undefined ? (
        <CircularProgress
          className={styles.progress}
          value={fileUploadProgress}
        />
      ) : (
        <FileDropArea
          className={styles['file-drop']}
          accept={accept}
          onFile={(file) => {
            onSubmit?.(file);
            setIsLoading(true);
          }}
        />
      )}
    </ModalDialog>
  );
}
