import { PropsMap } from '@/types/react';
import styles from './index.module.scss';
import { classNames } from '@/utils/classNames';
import { CloseIcon } from '@/icons/CloseIcon';
import { IconButton } from '../IconButton';

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
        className={styles['delete-image']}
        onClick={onDelete}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
