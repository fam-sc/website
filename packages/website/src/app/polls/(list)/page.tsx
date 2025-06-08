import { Pagination } from '@/components/Pagination';
import { ShortPollInfoList } from '@/components/ShortPollInfoList';
import { coerce } from '@shared/math';
import { parseInt } from '@shared/parseInt';
import { Repository } from '@data/repo';
import styles from './page.module.scss';
import { getCurrentUserInfo } from '@/api/user/client';
import { UserRole } from '@shared/api/user/types';
import { PlusIcon } from '@/icons/PlusIcon';
import { LinkButton } from '@/components/LinkButton';
import { redirect } from 'react-router';
import { Route } from './+types/page';
import { Title } from '@/components/Title';

const ITEMS_PER_PAGE = 20;

export async function loader({ request }: Route.LoaderArgs) {
  const userInfo = await getCurrentUserInfo();
  const canVisitPoll = userInfo !== null && userInfo.role >= UserRole.STUDENT;
  const canAddPoll = userInfo !== null && userInfo.role >= UserRole.ADMIN;

  const { searchParams } = new URL(request.url);

  const rawPage = searchParams.get('page');
  let page = parseInt(rawPage) ?? 1;

  await using repo = await Repository.openConnection();
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
    canAddPoll,
    canVisitPoll,
    items: items.map(({ _id, title }) => ({
      id: _id.toString(),
      title,
    })),
    page,
    totalPages,
  };
}

export default function Page({
  loaderData: { canAddPoll, canVisitPoll, items, page, totalPages },
}: Route.ComponentProps) {
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
