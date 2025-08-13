import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

import { classNames } from '@/utils/classNames';

import styles from './HoloText.module.scss';

export interface HoloTextProps {
  className?: string;
  text: string;
}

export function HoloText({ className, text }: HoloTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  const inView = useInView(ref, { once: true });

  return (
    <p ref={ref} className={classNames(styles.root, className)}>
      {[...text].map((value, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, translateY: 5 * i }}
          animate={inView && { scale: 1, translateY: 0 }}
          transition={{ delay: i * 0.025, ease: 'circOut' }}
        >
          {value}
        </motion.span>
      ))}
    </p>
  );
}
