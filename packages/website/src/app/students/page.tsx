import { ClientComponent } from './client';

import { UsefulLinkListItem } from '@/components/UsefulLinkList';
import { Repository } from '@/data/repo';

export default async function Page() {
  await using repo = await Repository.openConnection();
  const usefulLinks = await repo.usefulLinks().getAll().toArray();
  const usefulLinkItems: UsefulLinkListItem[] = usefulLinks.map(
    ({ _id, href, title }) => ({
      id: _id.toString(),
      href,
      title,
      imageSrc: `/api/usefulLinkImage/${_id.toString()}`,
    })
  );

  return <ClientComponent usefulLinks={usefulLinkItems} />;
}
