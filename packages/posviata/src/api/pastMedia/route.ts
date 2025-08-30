import { ok } from '@sc-fam/shared';
import { int, optional } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { repository } from '@/data/repo';

import { app } from '../app';
import { PastMediaEntry } from './types';

app.get(
  '/past-media',
  middlewareHandler(
    searchParams({ year: int(), lastId: optional(int()) }),
    async ({ data: [{ year, lastId }] }) => {
      const entries = await repository
        .pastMediaEntries()
        .selectAll<PastMediaEntry>(
          `SELECT id, type, path FROM past_media_entries WHERE year=? AND id > ? ORDER BY id ASC LIMIT 20`,
          [year, lastId ?? -1]
        );

      return ok<PastMediaEntry[]>(
        entries.map(({ path, ...rest }) => ({
          path: `/api/past-media/asset?path=${path}`,
          ...rest,
        }))
      );
    }
  )
);
