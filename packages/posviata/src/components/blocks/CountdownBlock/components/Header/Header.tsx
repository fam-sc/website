import { useEffect, useState } from 'react';

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
  const [text, setText] = useState(TEXT_1);
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    const id = setInterval(() => {
      setTimeout(() => {
        setText((prev) => (prev === TEXT_1 ? TEXT_2 : TEXT_1));
      }, TEXT_SWITCH_DELAY);

      setTimeout(() => {
        setState('idle');
      }, ANIMATION_DURATION);

      setState('animation');
    }, INTERVAL);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <p className={classNames(styles.root, styles[`root-${state}`], className)}>
      {text}
    </p>
  );
}
