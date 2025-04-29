import { Metadata } from 'next';

import { ClientComponent } from './client';

import { getCurrentTime } from '@/api/campus';
import { getFacultyGroupById } from '@/api/schedule';
import { normalizeGuid } from '@/utils/guid';
import { pick } from '@/utils/pick';
import { PageProps } from '@/types/next';

export const metadata: Metadata = {
  title: 'Розклад',
};

export default async function Page({ searchParams }: PageProps) {
  const { currentWeek } = await getCurrentTime();

  const { group: rawGroup } = await searchParams;
  const groupId =
    typeof rawGroup === 'string' && rawGroup.length > 0
      ? normalizeGuid(rawGroup)
      : null;
  const group = groupId === null ? null : await getFacultyGroupById(groupId);

  return (
    <ClientComponent
      initialGroup={group ? pick(group, ['campusId', 'name']) : null}
      initialWeek={currentWeek}
    />
  );
}
