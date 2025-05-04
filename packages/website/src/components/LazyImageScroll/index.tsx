import Image from 'next/image';
import { InfiniteScroll } from '../InfiniteScroll';
import styles from './index.module.scss';

export type LazyImageScrollProps = {
  className?: string;
  requestPage: (page: number) => Promise<string[]>;
  onImageClick: (value: string) => void;
};

export function LazyImageScroll({
  className,
  requestPage,
  onImageClick,
}: LazyImageScrollProps) {
  return (
    <InfiniteScroll
      className={className}
      contentClassName={styles.content}
      requestPage={requestPage}
    >
      {(src, index) => (
        <div key={`${src}-${index}`}>
          <Image
            src={src}
            alt=""
            width={0}
            height={0}
            onClick={() => {
              onImageClick(src);
            }}
          />

          <span />
        </div>
      )}
    </InfiniteScroll>
  );
}
