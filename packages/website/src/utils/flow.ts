import { NodeChange, NodeDimensionChange } from '@xyflow/react';

export function isAllDimensionChanges(
  changes: NodeChange[],
): changes is NodeDimensionChange[] {
  return changes.every((node) => node.type === 'dimensions');
}
