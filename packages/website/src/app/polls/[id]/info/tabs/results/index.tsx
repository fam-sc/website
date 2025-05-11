'use client';

import { fetchPollResultsTable } from '@/api/polls/client';
import { useDataLoader } from '@/hooks/useDataLoader';
import styles from './index.module.scss';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { Table } from '@/components/Table';

export type ResultsTabProps = {
  pollId: string;
};

export function ResultsTab({ pollId }: ResultsTabProps) {
  const [table, isPending] = useDataLoader(
    () => fetchPollResultsTable(pollId),
    [pollId]
  );

  return (
    <div className={styles.root}>
      {isPending ? (
        <IndeterminateCircularProgress className={styles.progress} />
      ) : (
        <div className={styles.content}>
          {table && (
            <Table numbered columns={table.questions} data={table.data} />
          )}
        </div>
      )}
    </div>
  );
}
