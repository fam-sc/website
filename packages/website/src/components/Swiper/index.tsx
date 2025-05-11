'use client';

import { Key, ReactNode, useEffect, useRef } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { SwiperManager } from './manager';

export type SwiperProps<T extends { id: Key }> = {
  className?: string;
  slides: T[];
  renderSlide: (value: T) => ReactNode;
};

export function Swiper<T extends { id: Key }>({
  className,
  slides,
  renderSlide,
}: SwiperProps<T>) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<SwiperManager>(null);

  useEffect(() => {
    if (stripRef.current !== null && indicatorRef.current !== null) {
      const manager = new SwiperManager();

      managerRef.current = manager;
      manager.connect(stripRef.current, indicatorRef.current);

      return () => {
        manager.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    managerRef.current?.setSlideCount(slides.length);
  }, [slides.length]);

  return (
    <div className={classNames(styles.root, className)}>
      <div
        className={styles.strip}
        ref={stripRef}
        style={{ '--slide-count': slides.length }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={styles['slide-wrapper']}
            data-selected={Math.floor(slides.length / 2) === index}
          >
            {renderSlide(slide)}
          </div>
        ))}
      </div>

      <div className={styles.indicator} ref={indicatorRef}>
        {slides.map((_, index) => (
          <button
            key={index}
            data-selected={Math.floor(slides.length / 2) === index}
            onClick={() => {
              managerRef.current?.setSelectedSlide(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
