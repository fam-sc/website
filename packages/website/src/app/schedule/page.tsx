import { ClientComponent } from './client';

import { getCurrentTime } from '@shared/api/campus';
import { Route } from './+types/page';
import { getFacultyGroupById } from '@/api/groups/get';

export async function loader({ request }: Route.LoaderArgs) {
  const { currentWeek } = await getCurrentTime();

  const { searchParams } = new URL(request.url);
  const rawGroup = searchParams.get('group');
  const groupId = rawGroup !== null && rawGroup.length > 0 ? rawGroup : null;

  const group = groupId !== null ? await getFacultyGroupById(groupId) : null;

  return { currentWeek, group };
}

export default function Page({
  loaderData: { currentWeek, group },
}: Route.ComponentProps) {
  return <ClientComponent initialGroup={group} initialWeek={currentWeek} />;
}
