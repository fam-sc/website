import { getLatestEvents } from '@/api/events/client';
import { DataLoadingContainer } from '@/components/DataLoadingContainer';
import { EventListItem } from '@/components/EventListItem';
import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { UsefulLinkList } from '@/components/UsefulLinkList';
import { useDataLoader } from '@/hooks/useDataLoader';
import { imageDataToClientImages } from '@/utils/image/transform';

import styles from './page.module.scss';
import { usefulLinks } from './usefulLinks';

export default function Page() {
  const [latestEvents, retry] = useDataLoader(getLatestEvents, []);

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

      <DataLoadingContainer
        value={latestEvents}
        onRetry={retry}
        className={styles.events}
      >
        {(items) => (
          <List>
            {items.map(({ id, images, ...rest }) => (
              <li key={id}>
                <EventListItem
                  {...rest}
                  images={imageDataToClientImages(`events/${id}`, images)}
                />
              </li>
            ))}
          </List>
        )}
      </DataLoadingContainer>

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
