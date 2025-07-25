import { UserRole } from '@sc-fam/data';
import { coerce, parseInt } from '@sc-fam/shared';
import { redirect } from 'react-router';

import { useAuthInfo } from '@/auth/context';
import { LinkButton } from '@/components/LinkButton';
import { Pagination } from '@/components/Pagination';
import { ShortPollInfoList } from '@/components/ShortPollInfoList';
import { Title } from '@/components/Title';
import { PlusIcon } from '@/icons/PlusIcon';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';

const ITEMS_PER_PAGE = 20;

export async function loader({ request, context }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);

  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage) ?? 1;

  const repo = repository(context);
  const { total: totalItems, items } = await repo
    .polls()
    .getPage(page - 1, ITEMS_PER_PAGE);

  const oldPage = page;
  page = coerce(page, 1, totalItems);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (oldPage !== page) {
    return redirect(`/polls/?page=${page}`);
  }

  return {
    items: items.map(({ id, title }) => ({
      id,
      title,
    })),
    page,
    totalPages,
  };
}

export default function Page({
  loaderData: { items, page, totalPages },
}: Route.ComponentProps) {
  const { user } = useAuthInfo();

  const canVisitPoll = user !== null && user.role >= UserRole.STUDENT;
  const canAddPoll = user !== null && user.role >= UserRole.ADMIN;

  return (
    <div className={styles.root}>
      <Title>Опитування</Title>

      {canAddPoll && (
        <LinkButton hasIcon className={styles['add-poll']} to="/polls/+">
          <PlusIcon aria-hidden />
          Додати
        </LinkButton>
      )}

      <ShortPollInfoList
        className={styles.list}
        items={items.map(({ id, title }) => ({
          id,
          title,
          href: `/polls/${id}`,
        }))}
        canVisitPoll={canVisitPoll}
      />

      {totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          current={page}
          total={totalPages}
          getLink={(page) => (page === 1 ? '/polls' : `/polls?page=${page}`)}
        />
      )}
    </div>
  );
}
