import { InfiniteScroll } from '../InfiniteScroll';
import styles from './index.module.scss';
import { usePageFetcher } from '@/hooks/usePageFetcher';
import { useNotification } from '../Notification';
import { List } from '../List';
import { useCallback } from 'react';
import { VarImage } from '../VarImage';
import { ImageInfo, ImageSizes } from '@/utils/image/types';

export type LazyImageScrollProps<T> = {
  className?: string;
  sizes?: ImageSizes;

  requestPage: (page: number) => Promise<T[]>;
  getImageInfo: (value: T) => string | ImageInfo | ImageInfo[];

  onImageClick: (value: T) => void;
};

export function LazyImageScroll<T>({
  className,
  sizes,
  requestPage,
  getImageInfo,
  onImageClick,
}: LazyImageScrollProps<T>) {
  const notification = useNotification();

  const onError = useCallback(() => {
    notification.show('Не вдалось завантажити фото', 'error');
  }, [notification]);

  const { items, hasMoreItems, onRequestNextPage } = usePageFetcher(
    requestPage,
    onError
  );

  return (
    <InfiniteScroll
      className={className}
      hasMoreElements={hasMoreItems}
      onRequesNextPage={onRequestNextPage}
    >
      <List className={styles.content}>
        {items.map((value, index) => {
          return (
            <div
              key={`${value}-${index}`}
              onClick={() => {
                onImageClick(value);
              }}
            >
              <VarImage image={getImageInfo(value)} sizes={sizes} />
              <span />
            </div>
          );
        })}
      </List>
    </InfiniteScroll>
  );
}
