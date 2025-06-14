import { usefulLinks } from './usefulLinks';

import styles from './page.module.scss';

import { Typography } from '@/components/Typography';
import { UsefulLinkList } from '@/components/UsefulLinkList';
import { ClientEvent } from '../events/(list)/client';
import { List } from '@/components/List';
import { EventListItem } from '@/components/EventListItem';
import { getMediaFileUrl } from '@/api/media';
import { LinkButton } from '@/components/LinkButton';
import { Title } from '@/components/Title';

export type ClientComponentProps = {
  latestEvents: ClientEvent[];
};

export function ClientComponent({ latestEvents }: ClientComponentProps) {
  return (
    <>
      <Title>Студентство</Title>

      <Typography variant="h4" className={styles['useful-links-title']}>
        Корисні джерела
      </Typography>
      <UsefulLinkList className={styles['useful-links']} items={usefulLinks} />

      <Typography variant="h4" className={styles['events-title']}>
        Заходи
      </Typography>

      <List className={styles.events}>
        {latestEvents.map(({ id, image, ...rest }) => (
          <li key={id}>
            <EventListItem
              {...rest}
              id={id}
              image={{
                src: getMediaFileUrl(`events/${id}`),
                width: image?.width ?? 0,
                height: image?.height ?? 0,
              }}
            />
          </li>
        ))}
      </List>

      <LinkButton
        to="/events"
        buttonVariant="solid"
        className={styles['events-more']}
      >
        Детальніше
      </LinkButton>
    </>
  );
}
