import { classNames } from '@sc-fam/shared';
import { ComponentProps, useId } from 'react';

import { Typography, TypographyVariant } from '../Typography';
import styles from './OptionBase.module.scss';

export interface OptionBaseProps
  extends Omit<ComponentProps<'input'>, 'value'> {
  type: 'radio' | 'checkbox';
  variant?: TypographyVariant;
  onCheckedChanged?: (state: boolean) => void;
}

export function OptionBase({
  className,
  type,
  disabled,
  children,
  variant,
  onCheckedChanged,
  ...rest
}: OptionBaseProps) {
  const inputId = useId();

  return (
    <Typography
      className={classNames(styles.root, className)}
      data-disabled={disabled}
      variant={variant}
      for={inputId}
      as="label"
    >
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        onChange={(event) => {
          const state = event.target.checked;

          onCheckedChanged?.(state);
        }}
        {...rest}
      />
      {children}
    </Typography>
  );
}
