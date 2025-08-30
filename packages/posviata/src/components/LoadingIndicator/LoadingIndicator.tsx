import { classNames } from '@sc-fam/shared';
import { Ref, useEffect, useRef } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { shuffle } from '@/utils/shuffle';

import styles from './LoadingIndicator.module.scss';

export interface LoadingIndicatorProps {
  ref?: Ref<HTMLDivElement | null>;
  className?: string;
}

const INDICES = [0, 1, 2, 3];
const NAMES = ['sin', 'cos', 'tg', 'ctg'];

export function LoadingIndicator({ ref, className }: LoadingIndicatorProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useInterval(500, () => {
    const root = rootRef.current;

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

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(rootRef.current);
      } else {
        ref.current = rootRef.current;
      }
    }
  }, [ref]);

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
