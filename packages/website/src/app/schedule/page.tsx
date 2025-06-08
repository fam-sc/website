import { ClientComponent } from './client';

import { getCurrentTime } from '@shared/api/campus';
import { cache } from 'react';
import { Group } from '@data/types';
import { getGroupById } from '@/api/groups/client';
import { Route } from './+types/page';

const getGroup = cache(async (groupId: string) => {
  return getGroupById(groupId);
});

async function getGroupFromSearchParams(
  searchParams: URLSearchParams
): Promise<Group | null> {
  const rawGroup = searchParams.get('group');
  const groupId = rawGroup !== null && rawGroup.length > 0 ? rawGroup : null;

  return groupId !== null ? await getGroup(groupId) : null;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { currentWeek } = await getCurrentTime();

  const { searchParams } = new URL(request.url);

  const group = await getGroupFromSearchParams(searchParams);

  return { currentWeek, group };
}

export default function Page({
  loaderData: { currentWeek, group },
}: Route.ComponentProps) {
  return <ClientComponent initialGroup={group} initialWeek={currentWeek} />;
}
