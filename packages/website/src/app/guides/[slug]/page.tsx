import { UserRole } from '@sc-fam/data';
import { notFound } from '@sc-fam/shared';
import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { deleteGuide } from '@/api/guides/client';
import { useAuthInfo } from '@/auth/context';
import { Article } from '@/components/Article';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Image } from '@/components/Image';
import { ModifyHeader } from '@/components/ModifyHeader';
import { RichText } from '@/components/RichText';
import { imageDataToClientImages } from '@/utils/image/transform';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import { GuideMeta } from './meta';
import styles from './page.module.scss';

export async function loader({ params: { slug }, context }: Route.LoaderArgs) {
  const repo = repository(context);
  const guide = await repo.guides().findBySlug(slug);

  if (guide === null) {
    return notFound();
  }

  return { guide };
}

export default function Page({ loaderData: { guide } }: Route.ComponentProps) {
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

  const onDeleteGuide = useCallback(() => {
    deleteGuide(guide.id)
      .then(() => {
        notification.show('Видалено', 'plain');

        return navigate('/guides');
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Сталася помилка при видаленні', 'error');
      });
  }, [guide.id, navigate, notification]);

  return (
    <Article className={styles.root}>
      <GuideMeta guide={guide} />

      <ModifyHeader
        title={guide.title}
        canEdit={canEdit}
        modifyHref={`/guides/+?edit=${guide.id}`}
        onDelete={onShowDeleteDialog}
      />

      {guide.images && (
        <Image
          className={styles.image}
          multiple={imageDataToClientImages(`guides/${guide.id}`, guide.images)}
        />
      )}

      <RichText text={guide.description} />

      {isDeleteDialogShown && (
        <ConfirmationDialog
          title="Ви справді хочете видалити гайд?"
          onClose={onClose}
          onConfirm={onDeleteGuide}
        />
      )}
    </Article>
  );
}
