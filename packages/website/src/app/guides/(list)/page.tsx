import { Guide, UserRole } from '@sc-fam/data';
import { coerce, parseInt } from '@sc-fam/shared';
import { formatDateTime } from '@sc-fam/shared/chrono';
import { shortenRichText } from '@sc-fam/shared/richText';
import { redirect } from 'react-router';

import { useAuthInfo } from '@/auth/context';
import { GuideListItem } from '@/components/GuideListItem';
import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { Pagination } from '@/components/Pagination';
import { PlusIcon } from '@/icons/PlusIcon';
import { sizesToImages } from '@/utils/image/transform';
import { createPageUrl } from '@/utils/page';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

const ITEMS_PER_PAGE = 5;

function toClientGuide(guide: Guide) {
  return {
    id: guide.id,
    title: guide.title,
    createdAt: formatDateTime(new Date(guide.createdAtDate)),
    updatedAt: formatDateTime(new Date(guide.updatedAtDate)),
    description: shortenRichText(guide.description, 200, 'ellipsis'),
    images: guide.images,
  };
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage) ?? 1;

  const repo = repository(context);
  const { total: totalItems, items } = await repo
    .guides()
    .getPage(page - 1, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const oldPage = page;
  page = coerce(page, 1, totalPages);

  if (oldPage !== page) {
    return redirect(`/guides/?page=${page}`);
  }

  return {
    items: items.map((item) => toClientGuide(item)),
    page,
    totalPages,
  };
}

export default function Page({
  loaderData: { items, page, totalPages },
}: Route.ComponentProps) {
  const { user } = useAuthInfo();
  const canAddEvent = user !== null && user.role >= UserRole.ADMIN;

  return (
    <div className={styles.root}>
      {canAddEvent && (
        <LinkButton hasIcon className={styles['add-guide']} to="/guides/+">
          <PlusIcon aria-hidden />
          Додати
        </LinkButton>
      )}

      <List className={styles.list}>
        {items.map(({ id, images, ...rest }) => (
          <li key={id}>
            <GuideListItem
              {...rest}
              id={id}
              images={sizesToImages(`guides/${id}`, images)}
            />
          </li>
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          current={page}
          total={totalPages}
          getLink={(page) => createPageUrl('/guides', page)}
        />
      )}
    </div>
  );
}
