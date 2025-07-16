import '@xyflow/react/dist/style.css';

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from '@xyflow/react';
import { useCallback, useMemo, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { BotFlowWithInMeta, BotFlowWithOutMeta } from '@/botFlow/types';
import { usePreventLeaving } from '@/hooks/usePreventLeaving';

import { BotFlowBoardActions } from '../BotFlowBoardActions';
import { ChangeType } from './changes';
import {
  botFlowToEdges,
  botFlowToNodes,
  reactFlowToBotFlow,
} from './converter';
import styles from './index.module.scss';
import { createFlowStore, FlowState, FlowStoreContext } from './store';
import { nodeTypes } from './types';

export type FlowchartBoardProps = {
  initialFlow: BotFlowWithOutMeta;

  onSave?: (flow: BotFlowWithInMeta, changes: ChangeType) => void;
};

const selector = (state: FlowState) => ({
  changes: state.changes,
  nodes: state.nodes,
  edges: state.edges,
  setUnchanged: state.setUnchanged,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addEmptyNode: state.addEmptyNode,
});

export function BotFlowBoard({ initialFlow, onSave }: FlowchartBoardProps) {
  const [initialNodes, initialEdges] = useMemo(
    () => [botFlowToNodes(initialFlow), botFlowToEdges(initialFlow)],
    // Only compute nodes and edges for initial value of initialFlow
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const store = useRef(createFlowStore({ initialEdges, initialNodes })).current;
  const {
    changes,
    edges,
    nodes,
    setUnchanged,
    onConnect,
    onEdgesChange,
    onNodesChange,
    addEmptyNode,
  } = useStore(store, useShallow(selector));

  const onSaveAction = useCallback(() => {
    onSave?.(reactFlowToBotFlow(nodes, edges), changes);
    setUnchanged();
  }, [changes, edges, nodes, onSave, setUnchanged]);

  const isChanged = changes !== ChangeType.NONE;

  usePreventLeaving(isChanged);

  return (
    <FlowStoreContext.Provider value={store}>
      <div className={styles.root}>
        <BotFlowBoardActions
          isChanged={isChanged}
          onAdd={addEmptyNode}
          onSave={onSaveAction}
        />
        <ReactFlow
          className={styles.flow}
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </FlowStoreContext.Provider>
  );
}
