import { Node, NodeChange } from '@xyflow/react';

export const enum ChangeType {
  NONE = 0b00,
  DATA = 0b01,
  POSITION = 0b10,
}

function getNodeChangeType(change: NodeChange<Node>): ChangeType {
  switch (change.type) {
    case 'add':
    case 'remove':
    case 'replace': {
      return ChangeType.DATA;
    }
    case 'position': {
      return ChangeType.POSITION;
    }
    case 'dimensions':
    case 'select': {
      return ChangeType.NONE;
    }
  }
}

function getChangeArrayType<T>(
  changes: T[],
  resolver: (change: T) => ChangeType
): ChangeType {
  let result: ChangeType = ChangeType.NONE;

  for (const change of changes) {
    result |= resolver(change);
  }

  return result;
}

export function getNodesChangeType(changes: NodeChange<Node>[]): ChangeType {
  return getChangeArrayType(changes, getNodeChangeType);
}
