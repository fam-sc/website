import { formatDateTime } from '@shared/date';
import { shortenRichText } from '@shared/richText/short';
import { WithId } from 'mongodb';
import { Event } from '@data/types';
import { Route } from './+types/page';
import { Repository } from '@data/repo';
import { usefulLinks } from './usefulLinks';
import { Typography } from '@/components/Typography';
import { UsefulLinkList } from '@/components/UsefulLinkList';
import { List } from '@/components/List';
import { EventListItem } from '@/components/EventListItem';
import { getMediaFileUrl } from '@/api/media';
import { LinkButton } from '@/components/LinkButton';
import { Title } from '@/components/Title';
import styles from './page.module.scss';

function toClientEvent(event: WithId<Event>) {
  return {
    id: event._id.toString(),
    status: event.status,
    title: event.title,
    date: formatDateTime(event.date),
    description: shortenRichText(event.description, 200, 'ellipsis'),
    images: event.images,
  };
}

export async function loader() {
  await using repo = await Repository.openConnection();
  const latestEvents = await repo.events().getLatestEvents(3);

  return { latestEvents: latestEvents.map((value) => toClientEvent(value)) };
}

export default function Page({
  loaderData: { latestEvents },
}: Route.ComponentProps) {
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
        {latestEvents.map(({ id, images, ...rest }) => (
          <li key={id}>
            <EventListItem
              {...rest}
              id={id}
              images={images.map(({ width, height }) => ({
                src: getMediaFileUrl(`events/${id}/${width}`),
                width,
                height,
              }))}
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
