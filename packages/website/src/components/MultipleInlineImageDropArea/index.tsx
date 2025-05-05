import { useState } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import { BaseFileDropArea } from '../BaseFileDropArea';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useNotification } from '../Notification';
import { classNames } from '@/utils/classNames';
import { DeleteButtonWrapper } from '../DeleteButtonWrapper';

export type MultipleInlineImageDropAreaProps = {
  className?: string;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
};

type FileWithDataUrl = {
  file: File;
  dataUrl: string;
};

export function MultipleInlineImageDropArea({
  className,
  disabled,
  onFiles,
}: MultipleInlineImageDropAreaProps) {
  const [files, setFiles] = useState<FileWithDataUrl[]>([]);
  const notification = useNotification();

  function fireOnFiles(list: FileWithDataUrl[]) {
    onFiles?.(list.map(({ file }) => file));
  }

  return (
    <div className={classNames(styles.root, className)}>
      {files.length > 0 && (
        <div className={styles['image-grid']}>
          {files.map(({ dataUrl }, i) => (
            <DeleteButtonWrapper
              key={i}
              disabled={disabled}
              onDelete={() => {
                const newFiles = files.filter((_, j) => i !== j);

                setFiles(newFiles);
                fireOnFiles(newFiles);
              }}
            >
              <Image src={dataUrl} alt="" width={0} height={0} />
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
          Promise.all(
            [...input].map(async (file) => ({
              file,
              dataUrl: await fileToDataUrl(file),
            }))
          )
            .then((result) => {
              setFiles((files) => [...files, ...result]);
              fireOnFiles([...files, ...result]);
            })
            .catch((error: unknown) => {
              console.error(error);

              notification.show('Не вдалось завантажити файли', 'error');
            });
        }}
      />
    </div>
  );
}
