'use client';

import {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import { useNotification } from '../Notification';

import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';

export type InfiniteScrollProps<T> = {
  className?: string;
  contentClassName?: string;

  requestPage: (page: number) => Promise<T[]>;
  children: (value: T, index: number) => ReactNode;
};

export type LoadMarkerProps = {
  ref?: Ref<SVGSVGElement>;
};

function LoadMarker({ ref }: LoadMarkerProps) {
  return (
    <IndeterminateCircularProgress
      className={styles['load-marker']}
      ref={ref}
    />
  );
}

export function InfiniteScroll<T>({
  className,
  contentClassName,
  requestPage,
  children,
}: InfiniteScrollProps<T>) {
  const maxPageRef = useRef(0);
  const requestInProgressRef = useRef(false);

  const [hasMoreElements, setHasMoreElements] = useState(true);
  const [items, setItems] = useState<T[]>([]);

  const maxMarkerRef = useRef<SVGSVGElement>(null);

  const notification = useNotification();

  const requestNextPage = useCallback(() => {
    if (!requestInProgressRef.current) {
      requestInProgressRef.current = true;

      requestPage(maxPageRef.current + 1)
        .then((page) => {
          if (page.length === 0) {
            setHasMoreElements(false);
          } else {
            setItems((items) => [...items, ...page]);
          }

          maxPageRef.current++;
          requestInProgressRef.current = false;
        })
        .catch((error: unknown) => {
          console.error(error);

          notification.show('Не вийшло завантажити сторінку', 'error');
          requestInProgressRef.current = false;
        });
    }
  }, [notification, requestPage]);

  useEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    const observer = new IntersectionObserver(
      () => {
        console.log('observe');
        requestNextPage();
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (maxMarker) {
      observer.observe(maxMarker);
    }

    return () => {
      observer.disconnect();
    };
  }, [requestNextPage]);

  useLayoutEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    if (maxMarker !== null) {
      const bounds = maxMarker.getBoundingClientRect();

      if (bounds.top <= window.innerHeight) {
        requestNextPage();
      }
    }
  }, [items, requestNextPage]);

  return (
    <div className={classNames(styles.root, className)}>
      <div className={contentClassName}>
        {items.map((item, i) => children(item, i))}
      </div>

      {hasMoreElements && <LoadMarker ref={maxMarkerRef} />}
    </div>
  );
}
