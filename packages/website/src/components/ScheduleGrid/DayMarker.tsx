import { Day } from '@data/types/schedule';
import { Typography } from '../Typography';
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
      className={styles.root}
      style={{ '--day': day }}
      data-is-empty={isEmpty}
    >
      {days[day - 1]}
    </Typography>
  );
}
