import { useCallback, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { classNames } from '@/utils/classNames';
import { DeleteButtonWrapper } from '../DeleteButtonWrapper';
import { imageFileGate } from '@/utils/fileGate';

export type MultipleInlineImageDropAreaProps = {
  className?: string;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
};

type FileWithObjectUrl = {
  file: File;
  url: string;
};

export function MultipleInlineImageDropArea({
  className,
  disabled,
  onFiles,
}: MultipleInlineImageDropAreaProps) {
  const [files, setFiles] = useState<FileWithObjectUrl[]>([]);

  useEffect(() => {
    onFiles?.(files.map(({ file }) => file));
  }, [onFiles, files]);

  const onFilesCallback = useCallback((input: FileList) => {
    const newFiles = [...input].map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles((files) => [...files, ...newFiles]);
  }, []);

  return (
    <div className={classNames(styles.root, className)}>
      {files.length > 0 && (
        <div className={styles['image-grid']}>
          {files.map(({ url }, i) => (
            <DeleteButtonWrapper
              key={i}
              disabled={disabled}
              onDelete={() => {
                URL.revokeObjectURL(files[i].url);

                setFiles((files) => {
                  const newFiles = [...files];
                  newFiles.splice(i, 1);

                  return newFiles;
                });
              }}
            >
              <img src={url} />
            </DeleteButtonWrapper>
          ))}
        </div>
      )}

      <BaseFileDropArea
        disabled={disabled}
        accept={imageFileGate}
        className={styles['drop-area']}
        uploadText="Виберіть файли"
        dragText="Або перетягніть їх"
        onFiles={onFilesCallback}
      />
    </div>
  );
}
