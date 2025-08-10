import { classNames } from '@/utils/classNames';

import { Typography, TypographyProps } from '../Typography';
import styles from './EvenSpacedText.module.scss';

export interface EvenSpacedTextProps extends TypographyProps {
  className?: string;
  children: string;
}

export function EvenSpacedText({
  className,
  children,
  ...rest
}: EvenSpacedTextProps) {
  return (
    <Typography className={classNames(styles.root, className)} {...rest}>
      {[...children].map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </Typography>
  );
}
