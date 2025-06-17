import styles from './page.module.scss';
import { Typography } from '@/components/Typography';
import { getMediaFileUrl } from '@/api/media';
import { RichText } from '@/components/RichText';
import { EditIcon } from '@/icons/EditIcon';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { classNames } from '@/utils/classNames';
import { ModalDialog } from '@/components/ModalDialog';
import { Button } from '@/components/Button';
import { useCallback, useMemo, useState } from 'react';
import { deleteEvent } from '@/api/events/client';
import { useNotification } from '@/components/Notification';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { RichTextString } from '@shared/richText/types';
import { ImageSize } from '@shared/image/types';
import { Link, useNavigate } from 'react-router';
import { richTextToPlainText } from '@shared/richText/plainTransform';
import { shortenByWord } from '@shared/string/shortenByWord';
import { Title } from '@/components/Title';
import { Image } from '@/components/Image';

export type ClientComponentProps = {
  event: {
    id: string;
    title: string;
    status: 'pending' | 'ended';
    date: Date;
    description: RichTextString;
    images: ImageSize[];
  };
};

type DeleteEventDialogProps = {
  onClose: () => void;
  onDelete: () => void;
};

function DeleteEventDialog({ onClose, onDelete }: DeleteEventDialogProps) {
  const onCloseAndDelete = useCallback(() => {
    onClose();
    onDelete();
  }, [onClose, onDelete]);

  return (
    <ModalDialog
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Ні</Button>
          <Button onClick={onCloseAndDelete} buttonVariant="solid">
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
  const navigate = useNavigate();
  const notification = useNotification();

  const { user } = useAuthInfo();
  const canEdit = user !== null && user.role >= UserRole.ADMIN;

  const shortDescription = useMemo(
    () => shortenByWord(richTextToPlainText(event.description), 200),
    [event.description]
  );

  const onClose = useCallback(() => {
    setDeleteDialogShown(false);
  }, []);

  const onDeleteEvent = useCallback(() => {
    deleteEvent(event.id)
      .then(() => {
        notification.show('Видалено', 'plain');
        void navigate('/events');
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Сталася помилка при видаленні', 'error');
      });
  }, [event.id, navigate, notification]);

  return (
    <div className={styles.root}>
      <Title>{event.title}</Title>
      <meta name="description" content={shortDescription} />

      <div className={styles.header}>
        <Typography variant="h4">{event.title}</Typography>

        {canEdit && (
          <div className={styles['modify-buttons']}>
            <Link
              to={`/events/+?edit=${event.id}`}
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
        multiple={event.images.map(({ width, height }) => ({
          src: getMediaFileUrl(`events/${event.id}/${width}`),
          width,
          height,
        }))}
      />

      <RichText text={event.description} />

      {isDeleteDialogShown && (
        <DeleteEventDialog onClose={onClose} onDelete={onDeleteEvent} />
      )}
    </div>
  );
}
