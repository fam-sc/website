import { Repository } from '@sc-fam/data';
import { normalizeGuid, notFound, ok } from '@sc-fam/shared';
import { getColors } from '@sc-fam/shared/api/google';
import { string } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';

import { ExportScheduleOptions } from './types';

app.get(
  '/schedule/export/options',
  middlewareHandler(
    searchParams({ groupId: string() }),
    async ({ data: [{ groupId }] }) => {
      const repo = Repository.openConnection();

      const { calendar: colors } = await getColors();
      const [group, { semesterStart, semesterEnd }] = await repo.batch([
        repo.groups().findByCampusId(normalizeGuid(groupId)),
        repo.globalOptions().getEntries(['semesterStart', 'semesterEnd']),
      ]);

      if (semesterStart === undefined || semesterEnd === undefined) {
        throw new Error('Invalid configuration: no semester start/end');
      }

      if (group === null) {
        return notFound({ message: 'Unknown group' });
      }

      return ok<ExportScheduleOptions>({
        colors,
        groupName: group.name,
        initialStartDate: semesterStart,
        initialEndDate: semesterEnd,
      });
    }
  )
);
