import { NotificationWrapper } from '@sc-fam/shared-ui';

import { PastEntryScroller } from '@/components/PastEntryScroller';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export type PastMediaPageProps = {
  year: number;
};

export function PastMediaPage({ year }: PastMediaPageProps) {
  return (
    <NotificationWrapper typography={Typography}>
      <Title>{`Посвята ${year}`}</Title>

      <Typography variant="h2" className={styles.title}>
        ПОСВЯТА {year}
      </Typography>
      <PastEntryScroller year={year} />
    </NotificationWrapper>
  );
}
