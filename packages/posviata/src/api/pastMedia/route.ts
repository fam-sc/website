import { ok } from '@sc-fam/shared';
import { int, optional } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { repository } from '@/data/repo';
import { PastMediaEntryType } from '@/data/types';

import { app } from '../app';
import { PastMediaEntry } from './types';

type DataEntry = {
  id: number;
  type: PastMediaEntryType;
  path: string;
  meta: string | null;
};

function transformEntry({ id, path, type, meta }: DataEntry): PastMediaEntry {
  const newPath = `https://posviata-media.sc-fam.org/${path}`;
  const dotIndex = newPath.lastIndexOf('.');
  const prefixPath = newPath.slice(0, dotIndex);
  const extension = newPath.slice(dotIndex);

  if (type === PastMediaEntryType.VIDEO) {
    const thumbnail = `${prefixPath}.thumbnail.jpeg`;

    return { id, type, path: newPath, thumbnail };
  }

  if (meta === null) {
    throw new Error(`Meta is null on image entry ${id}`);
  }

  const { widths } = JSON.parse(meta) as { widths?: number[] };
  if (widths === undefined) {
    throw new Error(`No widths on entry ${id}`);
  }

  return {
    id,
    type,
    path: newPath,
    alternative: Object.fromEntries(
      widths.map((width) => [width, `${prefixPath}.${width}${extension}`])
    ),
  };
}

app.get(
  '/past-media',
  middlewareHandler(
    searchParams({ year: int(), lastId: optional(int()) }),
    async ({ data: [{ year, lastId }] }) => {
      const entries = await repository
        .pastMediaEntries()
        .selectAll<DataEntry>(
          `SELECT id, type, path, meta FROM past_media_entries WHERE year=? AND id > ? ORDER BY id ASC LIMIT 20`,
          [year, lastId ?? -1]
        );

      return ok<PastMediaEntry[]>(
        entries.map((entry) => transformEntry(entry))
      );
    }
  )
);
