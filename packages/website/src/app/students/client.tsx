'use client';

import { usefulLinks } from './usefulLinks';

import styles from './page.module.scss';

import { Typography } from '@/components/Typography';
import { UsefulLinkList } from '@/components/UsefulLinkList';
import { ClientEvent } from '../events/(list)/client';
import { List } from '@/components/List';
import { EventListItem } from '@/components/EventListItem';
import { getMediaFileUrl } from '@shared/media';
import { LinkButton } from '@/components/LinkButton';

export type ClientComponentProps = {
  latestEvents: ClientEvent[];
};

export function ClientComponent({ latestEvents }: ClientComponentProps) {
  return (
    <>
      <Typography variant="h4" className={styles['useful-links-title']}>
        Корисні джерела
      </Typography>
      <UsefulLinkList className={styles['useful-links']} items={usefulLinks} />

      <Typography variant="h4" className={styles['events-title']}>
        Заходи
      </Typography>

      <List className={styles.events}>
        {latestEvents.map((event) => (
          <li key={event.id}>
            <EventListItem
              {...event}
              imageSrc={getMediaFileUrl(`events/${event.id}`)}
            />
          </li>
        ))}
      </List>

      <LinkButton
        href="/events"
        buttonVariant="solid"
        className={styles['events-more']}
      >
        Детальніше
      </LinkButton>
    </>
  );
}
