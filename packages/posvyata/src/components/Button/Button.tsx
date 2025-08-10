import { classNames } from '@/utils/classNames';

import { Typography, TypographyProps } from '../Typography';
import styles from './Button.module.scss';

export type ButtonEffect = 'pixel-underline';

export interface ButtonProps extends TypographyProps {
  className?: string;
  hoverEffect?: ButtonEffect;
  children: string;
}

export function Button({
  className,
  children,
  hoverEffect,
  ...rest
}: ButtonProps) {
  return (
    <Typography
      as="button"
      className={classNames(
        styles.root,
        hoverEffect !== undefined && styles[`root-hover-${hoverEffect}`],
        className
      )}
      style={
        hoverEffect === 'pixel-underline' && {
          [`--text-length`]: children.length,
        }
      }
      {...rest}
    >
      {children}
    </Typography>
  );
}
