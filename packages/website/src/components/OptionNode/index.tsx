import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useStore } from 'zustand';

import { useFlowStore } from '../BotFlowBoard/store';
import { NodeContainer } from '../NodeContainer';
import { TextArea } from '../TextArea';

export type OptionNodeType = Node<{ text: string }, 'option'>;

export function OptionNode({ id, data }: NodeProps<OptionNodeType>) {
  const store = useFlowStore();
  const onTextChanged = useStore(store, (s) => s.onNodeTextChanged);

  return (
    <NodeContainer type="option">
      <TextArea
        value={data.text}
        onTextChanged={(text) => {
          onTextChanged(id, text);
        }}
      />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
}
