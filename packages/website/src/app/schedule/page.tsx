import { Metadata } from 'next';

import { ClientComponent } from './client';

import { getCurrentTime } from '@/api/campus';
import { getFacultyGroupById } from '@/api/schedule';
import { pick } from '@/utils/pick';

export const metadata: Metadata = {
  title: 'Розклад',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { group: rawGroup } = await searchParams;
  const { currentWeek } = await getCurrentTime();
  const groupId = typeof rawGroup === 'string' ? rawGroup : null;
  const group = groupId === null ? null : await getFacultyGroupById(groupId);

  return (
    <ClientComponent
      initialGroup={group ? pick(group, ['campusId', 'name']) : null}
      initialWeek={currentWeek}
    />
  );
}
