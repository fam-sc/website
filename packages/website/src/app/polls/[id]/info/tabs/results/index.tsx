import { fetchPollResultsTable } from '@/api/polls/client';
import { DataLoadingContainer } from '@/components/DataLoadingContainer';
import { Table } from '@/components/Table';
import { useDataLoader } from '@/hooks/useDataLoader';

import styles from './index.module.scss';

export type ResultsTabProps = {
  pollId: number;
};

export function ResultsTab({ pollId }: ResultsTabProps) {
  const [table, onRetry] = useDataLoader(
    () => fetchPollResultsTable(pollId),
    [pollId]
  );

  return (
    <DataLoadingContainer value={table} onRetry={onRetry}>
      {(table) => (
        <div className={styles.content}>
          <Table numbered columns={table.questions} data={table.data} />
        </div>
      )}
    </DataLoadingContainer>
  );
}
