import { Event } from '@sc-fam/data';
import { nearestSize } from '@sc-fam/shared/image';
import { richTextToPlainText } from '@sc-fam/shared/richText';
import { shortenByWord } from '@sc-fam/shared/string';
import { useMemo } from 'react';

import { getMediaFileUrl } from '@/api/media';
import { TelegramInstantViewMeta } from '@/components/TelegramInstantViewMeta';
import { Title } from '@/components/Title';

export function EventMeta({ event }: { event: Event }) {
  const shortDescription = useMemo(
    () => shortenByWord(richTextToPlainText(event.description), 200),
    [event.description]
  );

  const ogImage = useMemo(() => {
    const size = nearestSize(event.images.sizes, 1920);

    return getMediaFileUrl(`events/${event.id}/${size.width}`);
  }, [event]);

  return (
    <>
      <Title>{event.title}</Title>

      <meta property="description" content={shortDescription} />
      <meta property="og:description" content={shortDescription} />
      <meta property="og:image" content={ogImage} />

      <TelegramInstantViewMeta />
    </>
  );
}
