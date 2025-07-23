import { ReactNode } from 'react';

import { NodeType } from '../BotFlowBoard/types';
import styles from './NodeContainer.module.scss';

type NodeContainerProps = {
  type: NodeType;
  children: ReactNode;
};

export function NodeContainer({ type, children }: NodeContainerProps) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{type}</p>
      {children}
    </div>
  );
}
