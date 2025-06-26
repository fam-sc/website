import { formatDateTime } from '@shared/date';
import { shortenRichText } from '@shared/richText/short';
import { Event } from '@data/types';
import { Route } from './+types/page';
import { usefulLinks } from './usefulLinks';
import { Typography } from '@/components/Typography';
import { UsefulLinkList } from '@/components/UsefulLinkList';
import { List } from '@/components/List';
import { EventListItem } from '@/components/EventListItem';
import { getMediaFileUrl } from '@/api/media';
import { LinkButton } from '@/components/LinkButton';
import { Title } from '@/components/Title';
import styles from './page.module.scss';
import { repository } from '@/utils/repo';

function toClientEvent(event: Event) {
  return {
    id: event.id,
    status: event.status,
    title: event.title,
    date: formatDateTime(new Date(event.date)),
    description: shortenRichText(event.description, 200, 'ellipsis'),
    images: event.images,
  };
}

export async function loader({ context }: Route.LoaderArgs) {
  const repo = repository(context);
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
