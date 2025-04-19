import { OptionNode } from '../OptionNode';
import { ReceptacleNode } from '../ReceptacleNode';
import { StepNode } from '../StepNode';

export const nodeTypes = {
  step: StepNode,
  option: OptionNode,
  receptacle: ReceptacleNode,
};

export type NodeType = keyof typeof nodeTypes;
