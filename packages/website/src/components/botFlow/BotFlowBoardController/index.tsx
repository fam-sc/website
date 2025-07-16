import { useEffect, useState, useTransition } from 'react';

import { fetchBotFlow, updateBotFlow } from '@/api/botFlow/client';
import { BotFlowWithOutMeta } from '@/botFlow/types';

import { BotFlowBoard } from '../BotFlowBoard';
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

      {flow === undefined ? undefined : (
        <BotFlowBoard
          flow={flow}
          onSave={(newFlow) => {
            startTransition(async () => {
              const { steps, receptables, meta } = await updateBotFlow(newFlow);

              startTransition(() => {
                setFlow({
                  steps,
                  receptables,
                  meta: { icons: flow.meta.icons, positions: meta.positions },
                });
              });
            });
          }}
        />
      )}
    </div>
  );
}
