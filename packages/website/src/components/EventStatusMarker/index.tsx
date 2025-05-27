import { classNames } from '@/utils/classNames';
import { Typography } from '../Typography';
import styles from './index.module.scss';

export type EventStatusMarkerProps = {
  className?: string;
  status: 'pending' | 'ended';
};

export function EventStatusMarker({
  className,
  status,
}: EventStatusMarkerProps) {
  return status === 'ended' ? (
    <Typography className={classNames(styles.root, className)}>
      Закінчилась
    </Typography>
  ) : null;
}
