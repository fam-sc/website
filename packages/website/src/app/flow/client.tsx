'use client';

import { useState } from 'react';

import styles from './index.module.scss';

import { getBotFlow, saveBotFlow } from '@/api/botFlow';
import { BotFlowWithOutMeta } from '@/botFlow/types';
import { BotFlowBoard } from '@/components/BotFlowBoard';

type ClientComponentProps = {
  flow: BotFlowWithOutMeta;
};

export function ClientComponent({ flow: initialFlow }: ClientComponentProps) {
  const [flow, setFlow] = useState(initialFlow);
  const [isLoading, setLoading] = useState(false);

  return (
    <div className={styles.root}>
      <div data-visible={isLoading} className={styles['loading-pane']} />

      <BotFlowBoard
        flow={flow}
        onSave={(flow) => {
          console.log(flow);
          setLoading(true);
          saveBotFlow(flow)
            .then(() => {
              getBotFlow()
                .then((newFlow) => {
                  setLoading(false);
                  setFlow(newFlow);
                })
                .catch(() => {
                  globalThis.location.reload();
                });
            })
            .catch((error: unknown) => {
              console.error(error);
            });
        }}
      />
    </div>
  );
}
