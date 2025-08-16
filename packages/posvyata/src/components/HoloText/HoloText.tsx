import { classNames } from '@/utils/classNames';

import styles from './HoloText.module.scss';

export interface HoloTextProps {
  className?: string;
  text: string;
}

export function HoloText({ className, text }: HoloTextProps) {
  return <p className={classNames(styles.root, className)}>{text}</p>;
}
