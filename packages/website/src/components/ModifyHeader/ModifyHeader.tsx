import { classNames } from '@sc-fam/shared';
import { Link } from 'react-router';

import { DeleteIcon } from '@/icons/DeleteIcon';
import { EditIcon } from '@/icons/EditIcon';

import { Typography } from '../Typography';
import styles from './ModifyHeader.module.scss';

export interface ModifyHeaderProps {
  className?: string;
  title: string;
  canEdit: boolean;

  modifyHref: string;
  onDelete?: () => void;
}

export function ModifyHeader({
  className,
  title,
  canEdit,
  modifyHref,
  onDelete,
}: ModifyHeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Typography variant="h4">{title}</Typography>

      {canEdit && (
        <div className={styles['modify-buttons']}>
          <Link to={modifyHref} className={styles['modify-button']}>
            <EditIcon />
          </Link>

          <button
            className={classNames(styles['modify-button'], styles.delete)}
            onClick={onDelete}
          >
            <DeleteIcon />
          </button>
        </div>
      )}
    </div>
  );
}
