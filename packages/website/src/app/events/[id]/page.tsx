import { notFound } from '@shared/responses';
import { Route } from './+types/page';
import { deleteEvent } from '@/api/events/client';
import { getMediaFileUrl } from '@/api/media';
import { useAuthInfo } from '@/auth/context';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { useNotification } from '@/components/Notification';
import { RichText } from '@/components/RichText';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { EditIcon } from '@/icons/EditIcon';
import { classNames } from '@/utils/classNames';
import { UserRole } from '@data/types/user';
import { richTextToPlainText } from '@shared/richText/plainTransform';
import { shortenByWord } from '@shared/string/shortenByWord';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { DeleteEventDialog } from './DeleteEventDialog';
import styles from './page.module.scss';
import { Image } from '@/components/Image';
import { parseInt } from '@shared/parseInt';
import { repository } from '@/utils/repo';

export async function loader({ params, context }: Route.LoaderArgs) {
  const id = parseInt(params.id);
  if (id === undefined) {
    return notFound();
  }

  const repo = repository(context);
  const event = await repo.events().findById(id);

  if (event === null) {
    return notFound();
  }

  return { event };
}

export default function Page({ loaderData: { event } }: Route.ComponentProps) {
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
