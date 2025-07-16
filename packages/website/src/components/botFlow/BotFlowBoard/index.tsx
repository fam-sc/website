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
import {
  botFlowToEdges,
  botFlowToNodes,
  reactFlowToBotFlow,
} from './converter';
import styles from './index.module.scss';
import { createFlowStore, FlowState, FlowStoreContext } from './store';
import { nodeTypes } from './types';

export type FlowchartBoardProps = {
  flow: BotFlowWithOutMeta;

  onSave?: (flow: BotFlowWithInMeta) => void;
};

const selector = (state: FlowState) => ({
  isChanged: state.isChanged,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addEmptyNode: state.addEmptyNode,
});

export function BotFlowBoard({ flow, onSave }: FlowchartBoardProps) {
  const initialNodes = useMemo(() => botFlowToNodes(flow), [flow]);
  const initialEdges = useMemo(() => botFlowToEdges(flow), [flow]);

  const store = useRef(createFlowStore({ initialEdges, initialNodes })).current;
  const {
    isChanged,
    edges,
    nodes,
    onConnect,
    onEdgesChange,
    onNodesChange,
    addEmptyNode,
  } = useStore(store, useShallow(selector));

  const onSaveAction = useCallback(() => {
    onSave?.(reactFlowToBotFlow(nodes, edges));
  }, [edges, nodes, onSave]);

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
