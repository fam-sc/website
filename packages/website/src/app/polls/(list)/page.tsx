import { Pagination } from '@/components/Pagination';
import { ShortPollInfoList } from '@/components/ShortPollInfoList';
import { PageProps } from '@/types/next';
import { coerce } from '@shared/math';
import { parseInt } from '@shared/parseInt';
import { Repository } from '@data/repo';
import { redirect, RedirectType } from 'next/navigation';
import styles from './page.module.scss';
import { getCurrentUserInfo } from '@/api/user/client';
import { UserRole } from '@shared/api/user/types';
import { PlusIcon } from '@/icons/PlusIcon';
import { LinkButton } from '@/components/LinkButton';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: 'Опитування',
};

export default async function Page({ searchParams }: PageProps) {
  const userInfo = await getCurrentUserInfo();
  const canVisitPoll = userInfo !== null && userInfo.role >= UserRole.STUDENT;
  const canAddPoll = userInfo !== null && userInfo.role >= UserRole.ADMIN;

  const { page: rawPage } = await searchParams;
  let page = parseInt(rawPage) ?? 1;

  await using repo = await Repository.openConnection();
  const { total: totalItems, items } = await repo
    .polls()
    .getPage(page - 1, ITEMS_PER_PAGE);

  const oldPage = page;
  page = coerce(page, 1, totalItems);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (oldPage !== page) {
    redirect(`/polls/?page=${page}`, RedirectType.replace);
  }

  return (
    <div className={styles.root}>
      {canAddPoll && (
        <LinkButton hasIcon className={styles['add-poll']} href="/polls/+">
          <PlusIcon aria-hidden />
          Додати
        </LinkButton>
      )}

      <ShortPollInfoList
        className={styles.list}
        items={items.map(({ _id, title }) => ({
          id: _id.toString(),
          title,
          href: `/polls/${_id}`,
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
