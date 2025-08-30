import { NotificationWrapper } from '@sc-fam/shared-ui';

import { PastEntryScroller } from '@/components/PastEntryScroller';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

export type PastMediaPageProps = {
  year: number;
};

export function PastMediaPage({ year }: PastMediaPageProps) {
  return (
    <NotificationWrapper typography={Typography}>
      <Title>{`Посвята ${year}`}</Title>
      <PastEntryScroller year={year} />
    </NotificationWrapper>
  );
}
