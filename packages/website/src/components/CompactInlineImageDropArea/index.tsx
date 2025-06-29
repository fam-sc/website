import { useCallback } from 'react';

import { useCacheInvalidate } from '@/hooks/useCacheInvalidate';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import { imageFileGate } from '@/utils/fileGate';

import { useNotification } from '../Notification';
import { UploadFileButton } from '../UploadFileButton';
import styles from './index.module.scss';

type DivProps = PropsMap['div'];

export interface CompactInlineImageDropAreaProps extends DivProps {
  src: string | undefined;
  alt?: string;

  // Called when an user changes the image. Promise should be resolved when src points to the new image (it can be unchanged)
  onFileChanged: (file: File) => Promise<void>;
}

export function CompactInlineImageDropArea({
  className,
  src,
  alt,
  onFileChanged,
  ...rest
}: CompactInlineImageDropAreaProps) {
  const { src: updatedSrc, reload } = useCacheInvalidate(src);
  const notification = useNotification();

  const onFiles = useCallback(
    async (files: FileList) => {
      if (files.length > 0) {
        const file = files[0];

        try {
          const isValid = await imageFileGate.accept(file);
          if (isValid) {
            await onFileChanged(file);

            reload();
          }
        } catch (error: unknown) {
          console.error(error);

          notification.show('Не вдалось завантажити зображеня', 'error');
        }
      }
    },
    [notification, onFileChanged, reload]
  );

  return (
    <div
      className={classNames(styles.root, className)}
      data-has-image={src !== undefined}
      {...rest}
    >
      {updatedSrc !== undefined && <img src={updatedSrc} alt={alt ?? ''} />}

      <div className={styles['drop-area']}>
        <UploadFileButton buttonVariant="solid" onFiles={onFiles} />
      </div>
    </div>
  );
}
