import { useEffect, useState, useTransition } from 'react';

import {
  fetchBotFlow,
  updateBotFlow,
  updateBotFlowMeta,
} from '@/api/botFlow/client';
import { BotFlowWithOutMeta } from '@/botFlow/types';

import { BotFlowBoard } from '../BotFlowBoard';
import { ChangeType } from '../BotFlowBoard/changes';
import styles from './index.module.scss';

export function BotFlowBoardController() {
  const [flow, setFlow] = useState<BotFlowWithOutMeta>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const flow = await fetchBotFlow();

      startTransition(() => {
        setFlow(flow);
      });
    });
  }, []);

  return (
    <div className={styles.root}>
      <div data-visible={isPending} className={styles['loading-pane']} />

      {flow && (
        <BotFlowBoard
          flow={flow}
          onSave={(newFlow, changes) => {
            startTransition(async () => {
              await ((changes & ChangeType.POSITION) !== 0
                ? updateBotFlowMeta(newFlow.meta)
                : updateBotFlow(newFlow));
            });
          }}
        />
      )}
    </div>
  );
}
