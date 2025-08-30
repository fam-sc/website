import { classNames } from '@sc-fam/shared';
import { ReactNode, Ref, useId } from 'react';

import styles from './SwiperIndicator.module.scss';

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
  const globalId = useId();
  const elements: ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    elements.push(
      <button
        key={i}
        id={`${globalId}-${i}`}
        role="option"
        aria-selected={current === i}
        title={`Слайд ${i + 1}`}
        onClick={() => {
          onElementClick(i);
        }}
      />
    );
  }

  return (
    <div
      className={classNames(styles.root, className)}
      ref={ref}
      role="listbox"
      aria-multiselectable={false}
      aria-activedescendant={`${globalId}-${current}`}
    >
      {elements}
    </div>
  );
}
