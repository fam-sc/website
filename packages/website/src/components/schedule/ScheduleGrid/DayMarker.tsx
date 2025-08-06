import { Day } from '@/api/schedule/types';
import { classNames } from '@/utils/classNames';

import { Typography } from '../../Typography';
import styles from './DayMarker.module.scss';

const days = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  "П'ятниця",
  'Субота',
] as const;

export function DayMarker({ day, isEmpty }: { day: Day; isEmpty: boolean }) {
  return (
    <Typography
      className={classNames(styles.root, isEmpty && styles['root-empty'])}
      style={{ '--day': day }}
    >
      {days[day - 1]}
    </Typography>
  );
}
