import { createContext, useContext } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { createStore } from 'zustand';

import { NodeType } from './types';

import { isAllDimensionChanges } from '@/utils/flow';
import { findNextId } from '@/utils/ids';

export type FlowState = {
  isChanged: boolean;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  addEmptyNode: (type: NodeType) => void;

  onNodeTextChanged: (id: string, value: string) => void;
  onReceptacleEmojiChanged: (id: string, emoji: string) => void;
};

export type FlowStore = ReturnType<typeof createFlowStore>;

export function createFlowStore({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  return createStore<FlowState>()((set, get) => ({
    isChanged: false,
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => {
      set({
        isChanged: get().isChanged || !isAllDimensionChanges(changes),
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        isChanged: true,
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        isChanged: true,
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes) => {
      set({ nodes });
    },
    setEdges: (edges) => {
      set({ edges });
    },
    onNodeTextChanged: (id, text) => {
      set({
        isChanged: true,
        nodes: get().nodes.map((node) => {
          return node.id === id
            ? { ...node, data: { ...node.data, text } }
            : node;
        }),
      });
    },
    onReceptacleEmojiChanged: (id, emojiId) => {
      set({
        isChanged: true,
        nodes: get().nodes.map((node) => {
          return node.id === id
            ? { ...node, data: { ...node.data, emojiId } }
            : node;
        }),
      });
    },

    addEmptyNode: (type) => {
      let nodeData: Record<string, unknown>;
      switch (type) {
        case 'option':
        case 'step': {
          nodeData = { text: '' };
          break;
        }
        case 'receptacle': {
          nodeData = { emojiId: undefined };
          break;
        }
      }

      const nodes = get().nodes;

      set({
        isChanged: true,
        nodes: [
          ...nodes,
          {
            id: findNextId(type, nodes),
            data: nodeData,
            type,
            position: { x: 0, y: 0 },
          },
        ],
      });
    },
  }));
}

export const FlowStoreContext = createContext<FlowStore | null>(null);

export function useFlowStore(): FlowStore {
  const result = useContext(FlowStoreContext);
  if (result === null) {
    throw new Error('No FlowStoreContext in the tree');
  }

  return result;
}
