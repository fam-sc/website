import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { useStore } from 'zustand';

import { TextArea } from '../../TextArea';
import { useFlowStore } from '../BotFlowBoard/store';
import { NodeContainer } from '../NodeContainer';

export type StepNodeType = Node<{ text: string }, 'step'>;

export function StepNode({ id, data }: NodeProps<StepNodeType>) {
  const store = useFlowStore();
  const onTextChanged = useStore(store, (s) => s.onNodeTextChanged);

  return (
    <NodeContainer type="step">
      <TextArea
        autoSize
        variant="inverted-primary"
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
