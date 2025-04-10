import { JSX } from 'react';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

type ButtonVariant = 'primary' | 'flat';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: ButtonVariant;
};

export function Button({ className, variant, ...rest }: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.root,
        styles[`root-${variant ?? 'flat'}`],
        className
      )}
      {...rest}
    />
  );
}
