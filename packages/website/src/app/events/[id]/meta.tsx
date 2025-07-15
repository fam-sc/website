import { Event } from '@data/types';
import { nearestSize } from '@shared/image/utils';
import { richTextToPlainText } from '@shared/richText/plainTransform';
import { shortenByWord } from '@shared/string/shortenByWord';
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
    const size = nearestSize(event.images, 1920);

    return getMediaFileUrl(`events/${event.id}/${size.width}`);
  }, [event]);

  return (
    <>
      <Title>{event.title}</Title>
      <meta name="description" content={shortDescription} />
      <meta name="og:image" content={ogImage} />

      <TelegramInstantViewMeta />
    </>
  );
}
