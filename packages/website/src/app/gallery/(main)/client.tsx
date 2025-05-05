'use client';

import { LazyImageScroll } from '@/components/LazyImageScroll';
import styles from './page.module.scss';
import { fetchGalleryPage } from '@/api/gallery/client';
import { getMediaFileUrl } from '@/api/media';
import Link from 'next/link';
import { UploadIcon } from '@/icons/UploadIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryImageInfoDialog } from './dialog';

export type ClientComponentProps = {
  canModify: boolean;
  selectedId: string | null;
};

export function ClientComponent({
  canModify,
  selectedId: initialSelectedId,
}: ClientComponentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId
  );

  const router = useRouter();

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
        requestPage={(page) => fetchGalleryPage(page)}
        getImageSource={(id) => getMediaFileUrl(`gallery/${id}`)}
        onImageClick={(id) => {
          router.replace(`/gallery?id=${id}`);
          setSelectedId(id);
        }}
      />
      {selectedId && (
        <GalleryImageInfoDialog
          id={selectedId}
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
