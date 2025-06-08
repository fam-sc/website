import { useState } from 'react';
import styles from './index.module.scss';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { classNames } from '@/utils/classNames';
import { DeleteButtonWrapper } from '../DeleteButtonWrapper';

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

  function fireOnFiles(list: FileWithObjectUrl[]) {
    onFiles?.(list.map(({ file }) => file));
  }

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

                const newFiles = [...files];
                newFiles.splice(i, 1);

                setFiles(newFiles);
                fireOnFiles(newFiles);
              }}
            >
              <img src={url} />
            </DeleteButtonWrapper>
          ))}
        </div>
      )}

      <BaseFileDropArea
        disabled={disabled}
        className={styles['drop-area']}
        uploadText="Виберіть файли"
        dragText="Або перетягніть їх"
        onFiles={(input) => {
          const newFiles = [...input].map((file) => ({
            file,
            url: URL.createObjectURL(file),
          }));

          setFiles((files) => [...files, ...newFiles]);
          fireOnFiles([...files, ...newFiles]);
        }}
      />
    </div>
  );
}
