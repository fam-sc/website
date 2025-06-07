import { Metadata } from 'next';

import { ClientComponent } from './client';

import { getCurrentTime } from '@shared/api/campus';
import { pick } from '@/utils/object/pick';
import { PageProps } from '@/types/next';
import { cache } from 'react';
import { Group } from '@data/types';
import { getGroupById } from '@/api/groups/client';

const getGroup = cache(async (groupId: string) => {
  return getGroupById(groupId);
});

async function getGroupFromSearchParams(
  searchParams: PageProps['searchParams']
): Promise<Group | null> {
  const { group: rawGroup } = await searchParams;
  const groupId =
    typeof rawGroup === 'string' && rawGroup.length > 0 ? rawGroup : null;

  return groupId !== null ? await getGroup(groupId) : null;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const group = await getGroupFromSearchParams(searchParams);

  return {
    title: group ? `Розклад групи ${group.name}` : 'Розклад',
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { currentWeek } = await getCurrentTime();

  const group = await getGroupFromSearchParams(searchParams);

  return (
    <ClientComponent
      initialGroup={group ? pick(group, ['campusId', 'name']) : null}
      initialWeek={currentWeek}
    />
  );
}
