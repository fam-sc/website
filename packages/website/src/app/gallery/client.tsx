'use client';

import { LazyImageScroll } from '@/components/LazyImageScroll';
import styles from './page.module.scss';
import { fetchGalleryPage } from '@/api/gallery/client';
import { getMediaFileUrl } from '@/api/media';
import Link from 'next/link';
import { UploadIcon } from '@/icons/UploadIcon';

export type ClientComponentProps = {
  canUpload: boolean;
};

export function ClientComponent({ canUpload }: ClientComponentProps) {
  return (
    <div className={styles.content}>
      {canUpload && (
        <Link className={styles.upload} href="/gallery/upload">
          <UploadIcon />
          Завантажити фото
        </Link>
      )}

      <LazyImageScroll
        className={styles['image-scroll']}
        requestPage={(page) => fetchGalleryPage(page)}
        getImageSource={(id) => getMediaFileUrl(`gallery/${id}`)}
        onImageClick={() => {}}
      />
    </div>
  );
}
