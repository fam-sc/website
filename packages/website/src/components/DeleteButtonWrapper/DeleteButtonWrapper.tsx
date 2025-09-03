import { classNames } from '@sc-fam/shared';
import { ComponentProps } from 'react';

import { CloseIcon } from '@/icons/CloseIcon';

import { IconButton } from '@sc-fam/shared-ui';
import styles from './DeleteButtonWrapper.module.scss';

export interface DeleteButtonWrapperProps extends ComponentProps<'div'> {
  disabled?: boolean;
  onDelete: () => void;
}

export function DeleteButtonWrapper({
  className,
  children,
  disabled,
  onDelete,
  ...rest
}: DeleteButtonWrapperProps) {
  return (
    <div
      className={classNames(
        styles.root,
        disabled && styles['root-disabled'],
        className
      )}
      {...rest}
    >
      {children}

      <IconButton
        disabled={disabled}
        hover="fill"
        title="Видалити"
        className={styles['delete-image']}
        onClick={onDelete}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
