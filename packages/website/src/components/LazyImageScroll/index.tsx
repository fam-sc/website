import Image from 'next/image';
import { InfiniteScroll } from '../InfiniteScroll';
import styles from './index.module.scss';

export type LazyImageScrollProps<T> = {
  className?: string;
  requestPage: (page: number) => Promise<T[]>;
  getImageSource: (value: T) => string;

  onImageClick: (value: T) => void;
};

export function LazyImageScroll<T>({
  className,
  requestPage,
  getImageSource,
  onImageClick,
}: LazyImageScrollProps<T>) {
  return (
    <InfiniteScroll
      className={className}
      contentClassName={styles.content}
      requestPage={requestPage}
    >
      {(value, index) => (
        <div key={`${value}-${index}`}>
          <Image
            src={getImageSource(value)}
            alt=""
            width={0}
            height={0}
            onClick={() => {
              onImageClick(value);
            }}
          />

          <span />
        </div>
      )}
    </InfiniteScroll>
  );
}
