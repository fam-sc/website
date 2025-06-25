import { Route } from './+types/page';
import { fetchGalleryPage } from '@/api/gallery/client';
import { GalleryImageWithSizes } from '@/api/gallery/types';
import { getMediaFileUrl } from '@/api/media';
import { useAuthInfo } from '@/auth/context';
import { LazyImageScroll } from '@/components/LazyImageScroll';
import { UploadIcon } from '@/icons/UploadIcon';
import { UserRole } from '@data/types/user';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { GalleryImageInfoDialog } from './dialog';
import styles from './page.module.scss';
import { parseInt } from '@shared/parseInt';
import { repository } from '@/utils/repo';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const numberId = parseInt(id);
  if (numberId === undefined) {
    return null;
  }

  const repo = repository(context);
  const sizes = await repo.galleryImages().getImageSizes(numberId);

  return sizes !== null ? { id: numberId, sizes } : null;
}

export default function Page({
  loaderData: initialSelected,
}: Route.ComponentProps) {
  const [selectedId, setSelectedId] = useState<GalleryImageWithSizes | null>(
    initialSelected
  );

  const navigate = useNavigate();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.ADMIN;

  const getImageInfo = useCallback(
    ({ id, sizes }: GalleryImageWithSizes) =>
      sizes.map(({ width, height }) => ({
        src: getMediaFileUrl(`gallery/${id}/${width}`),
        width,
        height,
      })),
    []
  );

  const onImageClick = useCallback(
    (item: GalleryImageWithSizes) => {
      void navigate(`/gallery?id=${item.id}`, { replace: true });
      setSelectedId(item);
    },
    [navigate]
  );

  const onClose = useCallback(() => {
    setSelectedId(null);
    void navigate(`/gallery`, { replace: true });
  }, [navigate]);

  return (
    <div className={styles.content}>
      {canModify && (
        <Link className={styles.upload} to="/gallery/upload">
          <UploadIcon />
          Завантажити фото
        </Link>
      )}

      <LazyImageScroll
        className={styles['image-scroll']}
        sizes={useMemo(() => ({ default: '30vw' }), [])}
        requestPage={fetchGalleryPage}
        getImageInfo={getImageInfo}
        onImageClick={onImageClick}
      />
      {selectedId && (
        <GalleryImageInfoDialog
          info={selectedId}
          canModify={canModify}
          onClose={onClose}
        />
      )}
    </div>
  );
}
