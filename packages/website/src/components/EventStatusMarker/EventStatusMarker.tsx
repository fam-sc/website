import { EventStatus } from '@sc-fam/data';

import { classNames } from '@/utils/classNames';

import { Typography } from '../Typography';
import styles from './EventStatusMarker.module.scss';

export type EventStatusMarkerProps = {
  className?: string;
  status: EventStatus;
};

export function EventStatusMarker({
  className,
  status,
}: EventStatusMarkerProps) {
  return status === EventStatus.ENDED ? (
    <Typography className={classNames(styles.root, className)}>
      Закінчилась
    </Typography>
  ) : null;
}
