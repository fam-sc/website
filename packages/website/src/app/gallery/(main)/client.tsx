import { LazyImageScroll } from '@/components/LazyImageScroll';
import styles from './page.module.scss';
import { fetchGalleryPage } from '@/api/gallery/client';
import { getMediaFileUrl } from '@/api/media';
import { UploadIcon } from '@/icons/UploadIcon';
import { useCallback, useMemo, useState } from 'react';
import { GalleryImageInfoDialog } from './dialog';
import { GalleryImageWithSizes } from '@/api/gallery/types';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { Link, useNavigate } from 'react-router';

export type ClientComponentProps = {
  selected: GalleryImageWithSizes | null;
};

export function ClientComponent({
  selected: initialSelected,
}: ClientComponentProps) {
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
