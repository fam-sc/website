'use client';

import { fetchGalleryImage, deleteGalleryImage } from '@/api/gallery/client';
import { GalleryImageWithEvent } from '@/api/gallery/types';
import { getMediaFileUrl } from '@/api/media';
import { IconButton } from '@/components/IconButton';
import { ModalOverlay } from '@/components/ModalOverlay';
import { useNotification } from '@/components/Notification';
import { Typography } from '@/components/Typography';
import { CloseIcon } from '@/icons/CloseIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { EventIcon } from '@/icons/EventIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { useState, useEffect } from 'react';

import styles from './dialog.module.scss';
import Image from 'next/image';

export type GalleryImageInfoDialogProps = {
  id: string;
  canModify: boolean;
  onClose: () => void;
};

export function GalleryImageInfoDialog({
  id,
  canModify,
  onClose,
}: GalleryImageInfoDialogProps) {
  const [value, setValue] = useState<GalleryImageWithEvent>();
  const notification = useNotification();

  useEffect(() => {
    fetchGalleryImage(id)
      .then((value) => {
        setValue(value);
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Сталася помилка', 'error');

        onClose();
      });
  }, [id, notification, onClose]);

  return (
    <ModalOverlay effect="blur" className={styles['dialog-modal-overlay']}>
      <IconButton
        className={styles['dialog-close']}
        hover="fill"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <div className={styles['dialog-container']}>
        <Image
          src={getMediaFileUrl(`gallery/${id}`)}
          alt=""
          width={0}
          height={0}
        />

        <div className={styles['dialog-right-side']}>
          {canModify && (
            <IconButton
              hover="fill"
              className={styles['dialog-delete']}
              onClick={() => {
                deleteGalleryImage(id)
                  .then(() => {
                    notification.show('Фото видалене', 'plain');
                    onClose();
                  })
                  .catch((error: unknown) => {
                    console.error(error);

                    notification.show('Сталася помилка', 'error');
                  });
              }}
            >
              <DeleteIcon />
            </IconButton>
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
