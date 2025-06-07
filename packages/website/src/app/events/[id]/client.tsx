'use client';

import styles from './page.module.scss';
import { Typography } from '@/components/Typography';
import { getMediaFileUrl } from '@shared/api/media';
import Image from 'next/image';
import { RichText } from '@/components/RichText';
import Link from 'next/link';
import { EditIcon } from '@/icons/EditIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { classNames } from '@/utils/classNames';
import { ModalDialog } from '@/components/ModalDialog';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { deleteEvent } from '@/api/events/client';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/Notification';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { RichTextString } from '@shared/richText/types';
import { ImageSize } from '@shared/image/types';

export type ClientComponentProps = {
  event: {
    id: string;
    title: string;
    status: 'pending' | 'ended';
    date: Date;
    description: RichTextString;
    image?: ImageSize;
  };
};

type DeleteEventDialogProps = {
  onClose: () => void;
  onDelete: () => void;
};

function DeleteEventDialog({ onClose, onDelete }: DeleteEventDialogProps) {
  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Ні</Button>
          <Button
            onClick={() => {
              onDelete();
              onClose();
            }}
            buttonVariant="solid"
          >
            Так
          </Button>
        </>
      }
    >
      <Typography>Ви справді хочете видалити подію?</Typography>
    </ModalDialog>
  );
}

export function ClientComponent({ event }: ClientComponentProps) {
  const [isDeleteDialogShown, setDeleteDialogShown] = useState(false);
  const router = useRouter();
  const notification = useNotification();

  const { user } = useAuthInfo();
  const canEdit = user !== null && user.role >= UserRole.ADMIN;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h4">{event.title}</Typography>

        {canEdit && (
          <div className={styles['modify-buttons']}>
            <Link
              href={`/events/+?edit=${event.id}`}
              className={styles['modify-button']}
            >
              <EditIcon />
            </Link>

            <button
              className={classNames(styles['modify-button'], styles.delete)}
              onClick={() => {
                setDeleteDialogShown(true);
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>

      <EventStatusMarker className={styles.status} status={event.status} />

      <Image
        className={styles.image}
        src={getMediaFileUrl(`events/${event.id}`)}
        alt=""
        width={event.image?.width ?? 0}
        height={event.image?.height ?? 0}
      />

      <RichText text={event.description} />

      {isDeleteDialogShown && (
        <DeleteEventDialog
          onClose={() => {
            setDeleteDialogShown(false);
          }}
          onDelete={() => {
            deleteEvent(event.id)
              .then(() => {
                notification.show('Видалено', 'plain');
                router.push('/events');
              })
              .catch((error: unknown) => {
                console.error(error);

                notification.show('Сталася помилка при видаленні', 'error');
              });
          }}
        />
      )}
    </div>
  );
}
