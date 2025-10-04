import { Repository } from '@sc-fam/data';
import { ok } from '@sc-fam/shared';
import { getColors } from '@sc-fam/shared/api/google/calendar';
import { string } from '@sc-fam/shared/minivalidate';
import { middlewareHandler, searchParams } from '@sc-fam/shared/router';

import { app } from '@/api/app';

import { accessToken } from '../accessToken';
import { ExportScheduleOptions } from './types';

app.get(
  '/schedule/export/options',
  middlewareHandler(
    accessToken(),
    searchParams({ group: string() }),
    async ({ data: [access, { group: groupName }] }) => {
      const repo = Repository.openConnection();

      const { calendar: colors } = await getColors(access);

      const { semesterStart, semesterEnd } = await repo
        .globalOptions()
        .getEntries(['semesterStart', 'semesterEnd'])
        .get();

      if (semesterStart === undefined || semesterEnd === undefined) {
        throw new Error('Invalid configuration: no semester start/end');
      }

      return ok<ExportScheduleOptions>({
        groupName,
        colors,
        initialStartDate: semesterStart,
        initialEndDate: semesterEnd,
      });
    }
  )
);
