import { Day } from '@shared/api/schedule/types';
import { Typography } from '../Typography';
import styles from './DayMarker.module.scss';
import { classNames } from '@/utils/classNames';

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
