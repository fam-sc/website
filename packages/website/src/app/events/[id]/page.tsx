import { UserRole } from '@sc-fam/data';
import { notFound, parseInt } from '@sc-fam/shared';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { deleteEvent } from '@/api/events/client';
import { getMediaFileUrl } from '@/api/media';
import { useAuthInfo } from '@/auth/context';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { Image } from '@/components/Image';
import { useNotification } from '@/components/Notification';
import { RichText } from '@/components/RichText';
import { Typography } from '@/components/Typography';
import { DeleteIcon } from '@/icons/DeleteIcon';
import { EditIcon } from '@/icons/EditIcon';
import { classNames } from '@/utils/classNames';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import { DeleteEventDialog } from './DeleteEventDialog';
import { EventMeta } from './meta';
import styles from './page.module.scss';

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

  // Telegram IV requires this layout with <div class="article"> and <article class="article__content">
  return (
    <div className="article">
      <article className={classNames(styles.root, 'article__content')}>
        <EventMeta event={event} />

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
            // Telegram IV needs the image to have an extension. It doesn't really matter what.
            src: getMediaFileUrl(`events/${event.id}/${width}.png`),
            width,
            height,
          }))}
        />

        <RichText text={event.description} />

        {isDeleteDialogShown && (
          <DeleteEventDialog onClose={onClose} onDelete={onDeleteEvent} />
        )}
      </article>
    </div>
  );
}
