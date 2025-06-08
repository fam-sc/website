

import { useCallback, useState } from 'react';
import { useNotification } from '../Notification';
import { classNames } from '@/utils/classNames';
import styles from './index.module.scss';
import { PropsMap } from '@/types/react';
import { UploadFileButton } from '../UploadFileButton';

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
  const [cacheInvalidate, setCacheInvalidate] = useState<string>();
  const notification = useNotification();

  const onFiles = useCallback(
    (files: FileList) => {
      if (files.length > 0) {
        const file = files[0];

        onFileChanged(file)
          .then(() => {
            setCacheInvalidate(Date.now().toString());
          })
          .catch((error: unknown) => {
            console.error(error);

            notification.show('Не вдалось завантажити зображеня', 'error');
          });
      }
    },
    [notification, onFileChanged]
  );

  return (
    <div
      className={classNames(styles.root, className)}
      data-has-image={src !== undefined}
      {...rest}
    >
      {src !== undefined && (
        <img
          src={
            cacheInvalidate === undefined ? src : `${src}?${cacheInvalidate}`
          }
          alt={alt ?? ''}
          width={0}
          height={0}
        />
      )}

      <div className={styles['drop-area']}>
        <UploadFileButton buttonVariant="solid" onFiles={onFiles} />
      </div>
    </div>
  );
}
