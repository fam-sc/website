import { PastEntryScroller } from '@/components/PastEntryScroller';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export type PastMediaPageProps = {
  year: number;
};

export function PastMediaPage({ year }: PastMediaPageProps) {
  return (
    <>
      <Title>{`ПОСВЯТА ${year}`}</Title>

      <Typography variant="h2" className={styles.title}>
        ПОСВЯТА {year}
      </Typography>
      <PastEntryScroller year={year} />
    </>
  );
}
