import '@xyflow/react/dist/style.css';

import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlow,
} from '@xyflow/react';
import React, { useMemo, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { BotFlowWithInMeta, BotFlowWithOutMeta } from '@/botFlow/types';

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
  const initialNodes = useMemo((): Node[] => {
    return botFlowToNodes(flow);
  }, [flow]);

  const initialEdges = useMemo((): Edge[] => {
    return botFlowToEdges(flow);
  }, [flow]);

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

  return (
    <FlowStoreContext.Provider value={store}>
      <div className={styles.root}>
        <BotFlowBoardActions
          isChanged={isChanged}
          onAdd={addEmptyNode}
          onSave={() => onSave?.(reactFlowToBotFlow(nodes, edges))}
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
