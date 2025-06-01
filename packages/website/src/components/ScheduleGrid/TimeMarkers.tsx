import { timeBreakpoints } from '@shared/api/campus/types';
import { ReactNode } from 'react';
import { Typography } from '../Typography';
import styles from './TimeMarkers.module.scss';

function TimeMarker({ index }: { index: number }) {
  return (
    <Typography className={styles['time-marker']} style={{ '--index': index }}>
      {timeBreakpoints[index]}
    </Typography>
  );
}

export function TimeMarkers({ count }: { count: number }) {
  const result: ReactNode[] = [];

  for (let i = 0; i <= count; i++) {
    result.push(<TimeMarker index={i} />);
  }

  return result;
}
