import { ReactNode, Ref } from 'react';
import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';

export type SwiperIndicatorProps = {
  ref?: Ref<HTMLDivElement>;
  className?: string;

  current: number;
  count: number;

  onElementClick: (index: number) => void;
};

export function SwiperIndicator({
  className,
  ref,
  current,
  count,
  onElementClick,
}: SwiperIndicatorProps) {
  const elements: ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    elements.push(
      <button
        key={i}
        data-selected={current === i}
        onClick={() => {
          onElementClick(i);
        }}
      />
    );
  }

  return (
    <div className={classNames(styles.root, className)} ref={ref} aria-hidden>
      {elements}
    </div>
  );
}
