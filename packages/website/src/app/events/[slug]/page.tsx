import { UserRole } from '@sc-fam/data';
import { notFound } from '@sc-fam/shared';
import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { deleteEvent } from '@/api/events/client';
import { useAuthInfo } from '@/auth/context';
import { Article } from '@/components/Article';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { EventStatusMarker } from '@/components/EventStatusMarker';
import { Image } from '@/components/Image';
import { ModifyHeader } from '@/components/ModifyHeader';
import { RichText } from '@/components/RichText';
import { sizesToImages } from '@/utils/image/transform';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import { EventMeta } from './meta';
import styles from './page.module.scss';

export async function loader({ params, context }: Route.LoaderArgs) {
  const repo = repository(context);
  const event = await repo.events().findBySlug(params.slug);

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

  const onShowDeleteDialog = useCallback(() => {
    setDeleteDialogShown(true);
  }, []);

  const onClose = useCallback(() => {
    setDeleteDialogShown(false);
  }, []);

  const onDeleteEvent = useCallback(() => {
    deleteEvent(event.id)
      .then(() => {
        notification.show('Видалено', 'plain');

        return navigate('/events');
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Сталася помилка при видаленні', 'error');
      });
  }, [event.id, navigate, notification]);

  return (
    <Article className={styles.root}>
      <EventMeta event={event} />

      <ModifyHeader
        title={event.title}
        canEdit={canEdit}
        modifyHref={`/events/+?edit=${event.id}`}
        onDelete={onShowDeleteDialog}
      />

      <EventStatusMarker className={styles.status} status={event.status} />

      <Image
        className={styles.image}
        multiple={sizesToImages(`events/${event.id}`, event.images)}
      />

      <RichText text={event.description} />

      {isDeleteDialogShown && (
        <ConfirmationDialog
          title="Ви справді хочете видалити подію?"
          onClose={onClose}
          onConfirm={onDeleteEvent}
        />
      )}
    </Article>
  );
}
