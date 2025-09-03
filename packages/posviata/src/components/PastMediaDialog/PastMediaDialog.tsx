import { classNames } from '@sc-fam/shared';
import { IconButton, IconLinkButton } from '@sc-fam/shared-ui';
import { MouseEvent, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { PastMediaEntry } from '@/api/pastMedia/types';
import { PastMediaEntryType } from '@/data/types';
import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { DownloadIcon } from '@/icons/Download';

import { PastMediaImage } from '../PastMediaImage';
import styles from './PastMediaDialog.module.scss';

export interface PastMediaDialogProps {
  item: PastMediaEntry;
  onClose: () => void;
}

export function PastMediaDialog({ item, onClose }: PastMediaDialogProps) {
  const downloadUrl = useMemo(() => {
    const { pathname } = new URL(item.path);

    return `/api/past-media/download?path=${pathname.slice(1)}`;
  }, [item.path]);

  useScrollbar(false);

  const stopPropHandler = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  return createPortal(
    <div className={styles.root} onClick={onClose}>
      <div className={styles.toolbar}>
        <IconLinkButton
          title="Завантажити"
          href={downloadUrl}
          hover="fill"
          plainLink
          download
        >
          <DownloadIcon className={styles['toolbar-icon']} />
        </IconLinkButton>

        <IconButton title="Закрити" onClick={onClose} hover="fill">
          <CloseIcon className={styles['toolbar-icon']} />
        </IconButton>
      </div>

      <div className={styles.dialog}>
        {item.type === PastMediaEntryType.IMAGE ? (
          <PastMediaImage
            className={classNames(styles['content'])}
            sources={item.alternative}
            onClick={stopPropHandler}
            fit="contain"
          />
        ) : (
          <video
            className={classNames(styles['content'])}
            src={item.path}
            poster={item.thumbnail}
            onClick={stopPropHandler}
            autoPlay
            controls
          />
        )}
      </div>
    </div>,
    document.body
  );
}
