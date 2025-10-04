import { useNotification } from '@sc-fam/shared-ui';

import { getPollSpreadsheetInfo, setPollSpreadsheet } from '@/api/polls/client';
import { useDataLoader } from '@/hooks/useDataLoader';

import { DataLoadingContainer } from '../DataLoadingContainer';
import { GoogleSpreadsheetLinker } from '../GoogleSpreadsheetLinker';

export interface PollSpreadsheetLinkerProps {
  className?: string;
  pollId: number;
}

export function PollSpreadsheetLinker({
  pollId,
  className,
}: PollSpreadsheetLinkerProps) {
  const [pollSpreadsheet, onRetry] = useDataLoader(
    () => getPollSpreadsheetInfo(pollId),
    [pollId]
  );

  const notification = useNotification();

  return (
    <DataLoadingContainer
      value={pollSpreadsheet}
      onRetry={onRetry}
      className={className}
    >
      {(info) => (
        <GoogleSpreadsheetLinker
          actionTitle="Прив'язати до таблиці"
          spreadsheet={info ?? undefined}
          onSpreadsheetLinked={(spreadsheetId) =>
            setPollSpreadsheet(pollId, { spreadsheetId })
              .then(() => {
                notification.show("Таблиця успішно прив'язана", 'plain');
              })
              .catch(() => {
                notification.show('Сталася помилка', 'error');
              })
          }
        />
      )}
    </DataLoadingContainer>
  );
}
