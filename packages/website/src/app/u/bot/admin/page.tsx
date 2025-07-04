import { BaseBotPage } from '../base';
import { parseSearchParamsToAuthPayload } from '../base/params';
import { Route } from './+types/page';

export function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const payload = parseSearchParamsToAuthPayload(searchParams);

  return { payload };
}

export default function Page({
  loaderData: { payload },
}: Route.ComponentProps) {
  return (
    <BaseBotPage type="admin" auth={payload.value} error={payload.error} />
  );
}
