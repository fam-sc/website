import { ReactNode, Ref, useEffect, useLayoutEffect, useRef } from 'react';

import { classNames } from '@/utils/classNames';

import { IndeterminateCircularProgress } from '../IndeterminateCircularProgress';
import styles from './InfiniteScroll.module.scss';

export type InfiniteScrollProps = {
  className?: string;
  hasMoreElements?: boolean;

  onRequesNextPage: () => void;

  children: ReactNode;
};

export type LoadMarkerProps = {
  ref?: Ref<SVGSVGElement>;
};

function LoadMarker({ ref }: LoadMarkerProps) {
  return (
    <IndeterminateCircularProgress
      className={styles['load-marker']}
      size="sm"
      ref={ref}
    />
  );
}

export function InfiniteScroll({
  className,
  hasMoreElements = true,
  onRequesNextPage,
  children,
}: InfiniteScrollProps) {
  const maxMarkerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    const observer = new IntersectionObserver(
      () => {
        onRequesNextPage();
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
  }, [onRequesNextPage]);

  useLayoutEffect(() => {
    const { current: maxMarker } = maxMarkerRef;

    if (maxMarker !== null) {
      const bounds = maxMarker.getBoundingClientRect();

      if (bounds.top <= window.innerHeight) {
        onRequesNextPage();
      }
    }
  }, [onRequesNextPage]);

  return (
    <div className={classNames(styles.root, className)}>
      {children}

      {hasMoreElements && <LoadMarker ref={maxMarkerRef} />}
    </div>
  );
}
