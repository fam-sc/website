import { IconButton, useNotification } from '@sc-fam/shared-ui';
import { useCallback, useEffect, useState } from 'react';

import { deleteGalleryImage, fetchGalleryImage } from '@/api/gallery/client';
import {
  GalleryImageWithEvent,
  GalleryImageWithSizes,
} from '@/api/gallery/types';
import { Image } from '@/components/Image';
import { InlineQuestion } from '@/components/InlineQuestion';
import { ModalOverlay } from '@/components/ModalOverlay';
import { Typography } from '@/components/Typography';
import { CloseIcon } from '@/icons/CloseIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { EventIcon } from '@/icons/EventIcon';
import { TimeIcon } from '@/icons/TimeIcon';
import { imageDataToClientImages } from '@/utils/image/transform';

import styles from './dialog.module.scss';

export type GalleryImageInfoDialogProps = {
  info: GalleryImageWithSizes;
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
      <IconButton
        className={styles.close}
        hover="fill"
        title="Закрити"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <div className={styles.content}>
        <Image
          multiple={imageDataToClientImages(
            `gallery/${info.id}`,
            info.imageData
          )}
          sizes={{ 900: '100vw', default: '60vw' }}
        />

        <div className={styles['info-side']}>
          {canModify && (
            <InlineQuestion
              className={styles.delete}
              position="right"
              questionText="Ви справді хочете видалити фото?"
              onAction={onAction}
            >
              <IconButton hover="fill" title="Видалити фото">
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
