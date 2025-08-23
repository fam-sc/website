import { useInView } from 'motion/react';
import { useRef, useState } from 'react';

import { useInterval } from '@/hooks/useInterval';
import { classNames } from '@/utils/classNames';

import styles from './Header.module.scss';

const TEXT_1 = 'Посвята';
const TEXT_2 = 'POSVIATA';

const INTERVAL = 3000;
const TEXT_SWITCH_DELAY = 125;
const ANIMATION_DURATION = 1000;

type State = 'idle' | 'animation';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [text, setText] = useState(TEXT_1);
  const [state, setState] = useState<State>('idle');
  const inView = useInView(ref, { initial: true });

  useInterval(
    INTERVAL,
    () => {
      setTimeout(() => {
        setText((prev) => (prev === TEXT_1 ? TEXT_2 : TEXT_1));
      }, TEXT_SWITCH_DELAY);

      setTimeout(() => {
        setState('idle');
      }, ANIMATION_DURATION);

      setState('animation');
    },
    inView
  );

  return (
    <p
      ref={ref}
      className={classNames(styles.root, styles[`root-${state}`], className)}
    >
      {text}
    </p>
  );
}
