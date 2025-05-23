import { Pagination } from '@/components/Pagination';
import { ShortPollInfoList } from '@/components/ShortPollInfoList';
import { PageProps } from '@/types/next';
import { coerce } from '@/utils/math';
import { parseInt } from '@/utils/parseInt';
import { Repository } from '@data/repo';
import { redirect, RedirectType } from 'next/navigation';
import styles from './page.module.scss';

const ITEMS_PER_PAGE = 20;

export default async function Page({ searchParams }: PageProps) {
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
    redirect(`/events/?page=${page}`, RedirectType.replace);
  }

  return (
    <div className={styles.root}>
      <ShortPollInfoList
        className={styles.list}
        items={items.map(({ _id, title }) => ({
          id: _id.toString(),
          title,
          href: `/polls/${_id}`,
        }))}
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
