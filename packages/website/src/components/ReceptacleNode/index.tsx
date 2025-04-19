'use client';

import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useStore } from 'zustand';

import { useFlowStore } from '../BotFlowBoard/store';
import { NodeContainer } from '../NodeContainer';
import { StickerSelect } from '../StickerSelect';

import { Sticker } from '@/botFlow/types';

type ReceptacleNodeType = Node<
  { stickers: Sticker[]; emojiId: string },
  'receptacle'
>;

export function ReceptacleNode({ id, data }: NodeProps<ReceptacleNodeType>) {
  const store = useFlowStore();
  const onEmojiChanged = useStore(
    store,
    (state) => state.onReceptacleEmojiChanged
  );

  return (
    <NodeContainer type="receptacle">
      <StickerSelect
        stickers={data.stickers}
        selectedStickerId={data.emojiId}
        onEmojiChanged={(emoji) => {
          onEmojiChanged(id, emoji);
        }}
      />

      <Handle type="target" position={Position.Top} />
    </NodeContainer>
  );
}
