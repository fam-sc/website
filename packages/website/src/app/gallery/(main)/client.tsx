'use client';

import { LazyImageScroll } from '@/components/LazyImageScroll';
import styles from './page.module.scss';
import { fetchGalleryPage } from '@/api/gallery/client';
import { getMediaFileUrl } from '@shared/media';
import Link from 'next/link';
import { UploadIcon } from '@/icons/UploadIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryImageInfoDialog } from './dialog';
import { GalleryImageWithSize } from '@/api/gallery/types';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';

export type ClientComponentProps = {
  selected: GalleryImageWithSize | null;
};

export function ClientComponent({
  selected: initialSelected,
}: ClientComponentProps) {
  const [selectedId, setSelectedId] = useState<GalleryImageWithSize | null>(
    initialSelected
  );

  const router = useRouter();

  const { user } = useAuthInfo();
  const canModify = user !== null && user.role >= UserRole.ADMIN;

  return (
    <div className={styles.content}>
      {canModify && (
        <Link className={styles.upload} href="/gallery/upload">
          <UploadIcon />
          Завантажити фото
        </Link>
      )}

      <LazyImageScroll
        className={styles['image-scroll']}
        requestPage={fetchGalleryPage}
        getImageInfo={({ id }) => getMediaFileUrl(`gallery/${id}`)}
        onImageClick={(item) => {
          router.replace(`/gallery?id=${item.id}`);
          setSelectedId(item);
        }}
      />
      {selectedId && (
        <GalleryImageInfoDialog
          info={selectedId}
          canModify={canModify}
          onClose={() => {
            setSelectedId(null);
            router.replace(`/gallery`);
          }}
        />
      )}
    </div>
  );
}
