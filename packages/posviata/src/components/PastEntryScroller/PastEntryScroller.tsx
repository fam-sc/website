import { InfiniteScroll, useNotification } from '@sc-fam/shared-ui';
import { useCallback, useState } from 'react';

import { getPastMediaEntryPage } from '@/api/client';
import { PastMediaEntry } from '@/api/pastMedia/types';
import { PastMediaEntryType } from '@/data/types';

import { LoadingIndicator } from '../LoadingIndicator';
import { PastMediaImage } from '../PastMediaImage';
import { PastMediaVideo } from '../PastMediaVideo';
import styles from './PastEntryScroller.module.scss';

export interface PastEntryScrollerProps {
  year: number;
}

export function PastEntryScroller({ year }: PastEntryScrollerProps) {
  const notification = useNotification();
  const [items, setItems] = useState<PastMediaEntry[]>([]);
  const [hasMoreElements, setHasMoreElements] = useState(true);

  const requestPage = useCallback(() => {
    console.log('here');
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
          {items.map(({ id, type, path }) =>
            type === PastMediaEntryType.IMAGE ? (
              <PastMediaImage key={id} path={path} />
            ) : (
              <PastMediaVideo key={id} path={path} />
            )
          )}
        </ul>
      </InfiniteScroll>
    </div>
  );
}
