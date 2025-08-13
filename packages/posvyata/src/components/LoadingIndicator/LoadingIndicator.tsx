import shuffle from 'lodash/shuffle';
import { motion } from 'motion/react';
import { useState } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { classNames } from '@/utils/classNames';

import styles from './LoadingIndicator.module.scss';

export interface LoadingIndicatorProps {
  className?: string;
}

const NAMES = ['sin', 'cos', 'tg', 'ctg'];

export function LoadingIndicator({ className }: LoadingIndicatorProps) {
  const [names, setNames] = useState(NAMES);

  useInterval(500, () => {
    setNames(shuffle(NAMES));
  });

  return (
    <div className={classNames(styles.root, className)}>
      {names.map((name) => (
        <motion.div key={name} className={styles.block} layout="position">
          <span>{name}</span>
        </motion.div>
      ))}
    </div>
  );
}
