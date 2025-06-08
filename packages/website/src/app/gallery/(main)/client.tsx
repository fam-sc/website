

import { LazyImageScroll } from '@/components/LazyImageScroll';
import styles from './page.module.scss';
import { fetchGalleryPage } from '@/api/gallery/client';
import { getMediaFileUrl } from '@shared/api/media';
import { UploadIcon } from '@/icons/UploadIcon';
import { useState } from 'react';
import { GalleryImageInfoDialog } from './dialog';
import { GalleryImageWithSize } from '@shared/api/gallery/types';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { Link, useNavigate } from 'react-router';

export type ClientComponentProps = {
  selected: GalleryImageWithSize | null;
};

export function ClientComponent({
  selected: initialSelected,
}: ClientComponentProps) {
  const [selectedId, setSelectedId] = useState<GalleryImageWithSize | null>(
    initialSelected
  );

  const navigate = useNavigate();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.ADMIN;

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
        requestPage={fetchGalleryPage}
        getImageInfo={({ id }) => getMediaFileUrl(`gallery/${id}`)}
        onImageClick={(item) => {
          navigate(`/gallery?id=${item.id}`, { replace: true });
          setSelectedId(item);
        }}
      />
      {selectedId && (
        <GalleryImageInfoDialog
          info={selectedId}
          canModify={canModify}
          onClose={() => {
            setSelectedId(null);
            navigate(`/gallery`, { replace: true });
          }}
        />
      )}
    </div>
  );
}
