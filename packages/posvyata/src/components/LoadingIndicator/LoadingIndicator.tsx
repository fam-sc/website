import shuffle from 'lodash/shuffle';
import { useRef } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { classNames } from '@/utils/classNames';

import styles from './LoadingIndicator.module.scss';

export interface LoadingIndicatorProps {
  className?: string;
}

const INDICES = [0, 1, 2, 3];
const NAMES = ['sin', 'cos', 'tg', 'ctg'];

export function LoadingIndicator({ className }: LoadingIndicatorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useInterval(500, () => {
    const root = ref.current;

    if (root) {
      const indices = shuffle(INDICES);

      for (let i = 0; i < indices.length; i += 1) {
        const index = indices[i];
        const { style } = root.children[i] as HTMLElement;

        const x = Math.floor(index / 2);
        const y = index % 2;

        style.setProperty('--x', x.toString());
        style.setProperty('--y', y.toString());
      }
    }
  });

  return (
    <div ref={ref} className={classNames(styles.root, className)}>
      {NAMES.map((name, index) => (
        <div key={index} className={styles.block}>
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
