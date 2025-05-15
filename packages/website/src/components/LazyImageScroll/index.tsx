import Image from 'next/image';
import { InfiniteScroll } from '../InfiniteScroll';
import styles from './index.module.scss';
import { usePageFetcher } from '@/hooks/usePageFetcher';
import { useNotification } from '../Notification';
import { List } from '../List';

export type LazyImageScrollProps<T> = {
  className?: string;
  requestPage: (page: number) => Promise<T[]>;
  getImageInfo: (
    value: T
  ) => string | { src: string; width: number; height: number };

  onImageClick: (value: T) => void;
};

export function LazyImageScroll<T>({
  className,
  requestPage,
  getImageInfo,
  onImageClick,
}: LazyImageScrollProps<T>) {
  const notification = useNotification();
  const { items, hasMoreItems, onRequestNextPage } = usePageFetcher(
    requestPage,
    () => {
      notification.show('Не вдалось завантажити фото', 'error');
    }
  );

  return (
    <InfiniteScroll
      className={className}
      hasMoreElements={hasMoreItems}
      onRequesNextPage={onRequestNextPage}
    >
      <List className={styles.content}>
        {items.map((value, index) => {
          const imageInfo = getImageInfo(value);

          return (
            <div
              key={`${value}-${index}`}
              onClick={() => {
                onImageClick(value);
              }}
            >
              {typeof imageInfo === 'string' ? (
                <Image src={imageInfo} alt="" width={0} height={0} />
              ) : (
                <Image
                  src={imageInfo.src}
                  alt=""
                  width={imageInfo.width}
                  height={imageInfo.height}
                />
              )}
              <span />
            </div>
          );
        })}
      </List>
    </InfiniteScroll>
  );
}
