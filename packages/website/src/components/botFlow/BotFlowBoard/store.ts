import { contextUseFactory } from '@sc-fam/shared-ui';
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
import { createContext } from 'react';
import { createStore } from 'zustand';

import { findNextId } from '@/utils/ids';

import { ChangeType, getNodesChangeType } from './changes';
import { NodeType } from './types';

export type FlowState = {
  changes: ChangeType;
  nodes: Node[];
  edges: Edge[];

  setUnchanged: () => void;
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
    changes: ChangeType.NONE,
    nodes: initialNodes,
    edges: initialEdges,
    setUnchanged: () => {
      set({ changes: ChangeType.NONE });
    },
    onNodesChange: (changes) => {
      set({
        changes: get().changes | getNodesChangeType(changes),
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        changes: get().changes | ChangeType.DATA,
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        changes: get().changes | ChangeType.DATA,
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
        changes: get().changes | ChangeType.DATA,
        nodes: get().nodes.map((node) => {
          return node.id === id
            ? { ...node, data: { ...node.data, text } }
            : node;
        }),
      });
    },
    onReceptacleEmojiChanged: (id, emojiId) => {
      set({
        changes: get().changes | ChangeType.DATA,
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

      const { nodes, changes } = get();

      set({
        changes: changes | ChangeType.DATA,
        nodes: [
          ...nodes,
          {
            id: findNextId(nodes),
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

export const useFlowStore = contextUseFactory(
  FlowStoreContext,
  'FlowStoreContext'
);
