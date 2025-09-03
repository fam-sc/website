import { InfiniteScroll, useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';

import { getPastMediaEntryPage } from '@/api/client';
import { PastMediaEntry } from '@/api/pastMedia/types';

import { LoadingIndicator } from '../LoadingIndicator';
import { PastMediaDialog } from '../PastMediaDialog';
import { PastMediaItem } from '../PastMediaItem';
import styles from './PastEntryScroller.module.scss';

export interface PastEntryScrollerProps {
  year: number;
}

export function PastEntryScroller({ year }: PastEntryScrollerProps) {
  const notification = useNotification();
  const [items, setItems] = useState<PastMediaEntry[]>([]);
  const [hasMoreElements, setHasMoreElements] = useState(true);

  const [selectedItem, setSelectedItem] = useState<PastMediaEntry | null>(null);

  const requestPage = useCallback(() => {
    const lastId = items.at(-1)?.id;

    getPastMediaEntryPage(year, lastId)
      .then((page) => {
        setHasMoreElements(page.length > 0);
        setItems((items) => [...items, ...page]);
      })
      .catch((error: unknown) => {
        console.error(error);

        notification.show('Не вдалося завантажити сторінку', 'error');
      });
  }, [items, notification, year]);

  return (
    <div className={styles.root}>
      <InfiniteScroll
        loadMarker={LoadingIndicator}
        onRequesNextPage={requestPage}
        hasMoreElements={hasMoreElements}
      >
        <ul className={styles.list}>
          {items.map((item) => (
            <PastMediaItem
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </ul>
      </InfiniteScroll>

      {selectedItem && (
        <PastMediaDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
