import React from 'react';

import { BlockContainer } from '../BlockContainer';
import styles from './ScheduleBlock.module.scss';

const events = {
  '1': '12:00',
  '2': '13:00',
  '3': '14:00',
  '4': '15:00',
  '5': '16:00',
  '6': '17:00',
  '7': '18:00',
};

export function ScheduleBlock() {
  return (
    <BlockContainer id="Події" className={styles.root}>
      <h2 className={styles.header}>Події</h2>

      <div className={styles.table}>
        <p className={styles['table-header']}>Час</p>
        <p className={styles['table-header']}>Подія</p>

        {Object.entries(events).map(([name, time]) => (
          <React.Fragment key={name}>
            <p className={styles.time}>{time}</p>
            <p className={styles.name}>{name}</p>
          </React.Fragment>
        ))}
      </div>
    </BlockContainer>
  );
}
