import { Guide } from '@sc-fam/data';
import { nearestSize } from '@sc-fam/shared/image';
import { richTextToPlainText } from '@sc-fam/shared/richText';
import { shortenByWord } from '@sc-fam/shared/string';
import { useMemo } from 'react';

import { getMediaFileUrl } from '@/api/media';
import { TelegramInstantViewMeta } from '@/components/TelegramInstantViewMeta';
import { Title } from '@/components/Title';

export function GuideMeta({ guide }: { guide: Guide }) {
  const shortDescription = useMemo(
    () => shortenByWord(richTextToPlainText(guide.description), 200),
    [guide.description]
  );

  const ogImage = useMemo(() => {
    if (guide.images) {
      const size = nearestSize(guide.images.sizes, 1920);

      return getMediaFileUrl(`guides/${guide.id}/${size.width}`);
    }
    return null;
  }, [guide]);

  return (
    <>
      <Title>{guide.title}</Title>

      <meta property="description" content={shortDescription} />
      <meta property="og:description" content={shortDescription} />
      {ogImage !== null && <meta property="og:image" content={ogImage} />}

      <TelegramInstantViewMeta />
    </>
  );
}
