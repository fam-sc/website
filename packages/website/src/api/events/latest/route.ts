import { Repository } from '@sc-fam/data';
import { ok } from '@sc-fam/shared';
import { formatDateTime } from '@sc-fam/shared/chrono';
import { shortenRichText } from '@sc-fam/shared/richText';

import { app } from '@/api/app';

import { Event } from '../types';

app.get('/events/latest', async () => {
  const repo = Repository.openConnection();
  const result = await repo.events().getLatestEvents(3);

  return ok(
    result.map(
      ({ date, description, ...rest }): Event => ({
        ...rest,
        date: formatDateTime(date),
        description: shortenRichText(description, 200, 'ellipsis'),
      })
    )
  );
});
