import { CloseIcon } from '@/icons/CloseIcon';
import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';

import { IconButton } from '../IconButton';
import styles from './DeleteButtonWrapper.module.scss';

type DivProps = PropsMap['div'];

export interface DeleteButtonWrapperProps extends DivProps {
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
