import { fetchGalleryImage, deleteGalleryImage } from '@/api/gallery/client';
import {
  GalleryImageWithEvent,
  GalleryImageWithSize,
} from '@shared/api/gallery/types';
import { getMediaFileUrl } from '@/api/media';
import { IconButton } from '@/components/IconButton';
import { ModalOverlay } from '@/components/ModalOverlay';
import { useNotification } from '@/components/Notification';
import { Typography } from '@/components/Typography';
import { CloseIcon } from '@/icons/CloseIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { EventIcon } from '@/icons/EventIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { useState, useEffect, useCallback } from 'react';

import styles from './dialog.module.scss';
import { InlineQuestion } from '@/components/InlineQuestion';

export type GalleryImageInfoDialogProps = {
  info: GalleryImageWithSize;
  canModify: boolean;
  onClose: () => void;
};

export function GalleryImageInfoDialog({
  info,
  canModify,
  onClose,
}: GalleryImageInfoDialogProps) {
  const [value, setValue] = useState<GalleryImageWithEvent>();
  const notification = useNotification();

  const onAction = useCallback(
    (type: 'yes' | 'no') => {
      if (type === 'yes') {
        deleteGalleryImage(info.id)
          .then(() => {
            notification.show('Фото видалене', 'plain');
            onClose();
          })
          .catch((error: unknown) => {
            console.error(error);

            notification.show('Сталася помилка', 'error');
          });
      }
    },
    [info.id, notification, onClose]
  );

  useEffect(() => {
    fetchGalleryImage(info.id)
      .then((value) => {
        setValue(value);
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Сталася помилка', 'error');

        onClose();
      });
  }, [info.id, notification, onClose]);

  return (
    <ModalOverlay effect="blur" className={styles['modal-overlay']}>
      <IconButton className={styles.close} hover="fill" onClick={onClose}>
        <CloseIcon />
      </IconButton>

      <div className={styles.content}>
        <img
          src={getMediaFileUrl(`gallery/${info.id}`)}
          alt=""
          width={info.width ?? 0}
          height={info.height ?? 0}
        />

        <div className={styles['info-side']}>
          {canModify && (
            <InlineQuestion
              className={styles.delete}
              position="right"
              questionText="Ви справді хочете видалити фото?"
              onAction={onAction}
            >
              <IconButton hover="fill">
                <DeleteIcon />
              </IconButton>
            </InlineQuestion>
          )}

          {value && (
            <>
              <Typography className={styles['text-with-icon']}>
                <TimeIcon />
                {value.date}
              </Typography>

              {value.event && (
                <Typography className={styles['text-with-icon']}>
                  <EventIcon />
                  {value.event.title}
                </Typography>
              )}
            </>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
