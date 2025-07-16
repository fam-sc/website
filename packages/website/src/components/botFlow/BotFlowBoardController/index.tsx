import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchBotFlow,
  updateBotFlow,
  updateBotFlowMeta,
} from '@/api/botFlow/client';
import { BotFlowWithInMeta } from '@/botFlow/types';
import { ErrorMessage } from '@/components/ErrorMessage';
import { IndeterminateCircularProgress } from '@/components/IndeterminateCircularProgress';
import { useDataLoader } from '@/hooks/useDataLoader';

import { BotFlowBoard } from '../BotFlowBoard';
import { ChangeType } from '../BotFlowBoard/changes';
import styles from './index.module.scss';

type BoardState = 'pending' | 'error-get' | 'error-update' | 'success';

export function BotFlowBoardController() {
  const [state, setState] = useState<BoardState>('pending');
  const [flowState, refresh] = useDataLoader(fetchBotFlow);

  const lastFlowToSave = useRef<{
    flow: BotFlowWithInMeta;
    changes: ChangeType;
  } | null>(null);

  useEffect(() => {
    const newState =
      flowState === 'pending'
        ? 'pending'
        : flowState === 'error'
          ? 'error-get'
          : 'success';

    setState(newState);
  }, [flowState]);

  const saveFlow = useCallback(
    async (newFlow: BotFlowWithInMeta, changes: ChangeType) => {
      lastFlowToSave.current = { flow: newFlow, changes };

      setState('pending');

      try {
        await ((changes & ChangeType.POSITION) !== 0
          ? updateBotFlowMeta(newFlow.meta)
          : updateBotFlow(newFlow));

        setState('success');
      } catch (error: unknown) {
        console.error(error);

        setState('error-update');
      }
    },
    []
  );

  const onRetrySaveFlow = useCallback(async () => {
    const lastFlow = lastFlowToSave.current;
    if (lastFlow !== null) {
      await saveFlow(lastFlow.flow, lastFlow.changes);
    }
  }, [saveFlow]);

  return (
    <div className={styles.root}>
      {state !== 'success' && (
        <div className={styles['overlay-pane']}>
          {state === 'pending' ? (
            <IndeterminateCircularProgress
              className={styles['loading-indicator']}
            />
          ) : state === 'error-get' ? (
            <ErrorMessage className={styles['error-message']} onRetry={refresh}>
              Не вдалось завантажити конфіг бота
            </ErrorMessage>
          ) : (
            <ErrorMessage
              className={styles['error-message']}
              onRetry={onRetrySaveFlow}
            >
              Не вдалось зберегти конфіг бота
            </ErrorMessage>
          )}
        </div>
      )}

      {typeof flowState === 'object' && (
        <BotFlowBoard initialFlow={flowState.value} onSave={saveFlow} />
      )}
    </div>
  );
}
