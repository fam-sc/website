import { Edge, Node } from '@xyflow/react';

import { NodeType } from './types';

import {
  BotFlow,
  BotFlowOutMeta,
  BotFlowWithInMeta,
  BotFlowWithOutMeta,
  Option,
  Position,
} from '@/botFlow/types';

function getPositionOrDefault(
  { positions }: BotFlowOutMeta,
  name: NodeType,
  id: string,
  defaultPoint: Position
): Position {
  if (positions !== undefined) {
    const point = positions[name][id];
    if (point !== undefined) {
      return point;
    }
  }

  return defaultPoint;
}

function getUnprefixedId(value: string): string {
  const dashIndex = value.indexOf('-');
  if (dashIndex === -1) {
    throw new Error('Invalid id');
  }

  return value.slice(dashIndex + 1);
}

function getNodeOfType(nodes: Node[], type: NodeType): Node[] {
  return nodes.filter((node) => node.type === type);
}

function getNodePositions(nodes: Node[]): Record<string, Position> {
  const result: Record<string, Position> = {};
  for (const node of nodes) {
    result[getUnprefixedId(node.id)] = node.position;
  }

  return result;
}

export function botFlowToNodes({
  steps,
  receptables,
  meta,
}: BotFlowWithOutMeta): Node[] {
  return [
    steps.flatMap((step, stepIndex) => [
      {
        id: `step-${step.id}`,
        type: 'step',
        position: getPositionOrDefault(meta, 'step', step.id, {
          x: stepIndex * 350,
          y: 0,
        }),
        data: { text: step.text },
      },
      ...step.options.map(
        (option, optionIndex): Node => ({
          id: `option-${option.id}`,
          type: 'option',
          position: getPositionOrDefault(meta, 'option', option.id, {
            x: stepIndex * 350,
            y: (optionIndex + 1) * 100,
          }),
          data: { text: option.text },
        })
      ),
    ]),
    receptables.map((value, index) => ({
      id: `receptacle-${value.id}`,
      type: 'receptacle',
      position: getPositionOrDefault(meta, 'receptacle', value.id, {
        x: 500,
        y: index * 500,
      }),
      data: { stickers: meta.icons, emojiId: value.emojiId },
    })),
  ].flat();
}

export function botFlowToEdges(flow: BotFlow): Edge[] {
  return flow.steps.flatMap((step) =>
    step.options.flatMap((option) => [
      {
        id: `step-option-${step.id}-${option.id}`,
        source: `step-${step.id}`,
        target: `option-${option.id}`,
      },
      ...(option.nextStepId === null
        ? option.receptacleId === null
          ? []
          : [
              {
                id: `step-receptacle-${step.id}-${option.receptacleId}`,
                source: `option-${option.id}`,
                target: `receptacle-${option.receptacleId}`,
              },
            ]
        : [
            {
              id: `step-step-${step.id}-${option.nextStepId}`,
              source: `option-${option.id}`,
              target: `step-${option.nextStepId}`,
            },
          ]),
    ])
  );
}

function findNodeOptions(
  stepId: string,
  nodes: Node[],
  edges: Edge[]
): Option[] {
  return edges
    .filter((edge) => edge.source === stepId)
    .map((edge) => {
      const optionNode = nodes.find((node) => node.id === edge.target);
      if (optionNode === undefined) {
        throw new Error('Cannot find target node');
      }

      const nextStepOrReceptacleNode = edges.find(
        (edge2) => edge2.source === edge.target
      );
      if (nextStepOrReceptacleNode === undefined) {
        throw new Error('Cannot find next node');
      }

      const nextId = getUnprefixedId(nextStepOrReceptacleNode.target);

      const result = {
        id: getUnprefixedId(edge.target),
        text: optionNode.data.text as string,
      };

      return nextStepOrReceptacleNode.target.startsWith('step')
        ? { ...result, nextStepId: nextId, receptacleId: null }
        : { ...result, receptacleId: nextId, nextStepId: null };
    });
}

export function reactFlowToBotFlow(
  nodes: Node[],
  edges: Edge[]
): BotFlowWithInMeta {
  const stepNodes = getNodeOfType(nodes, 'step');
  const optionNodes = getNodeOfType(nodes, 'option');
  const receptacleNodes = getNodeOfType(nodes, 'receptacle');

  return {
    steps: stepNodes.map((node) => ({
      id: getUnprefixedId(node.id),
      text: node.data.text as string,
      options: findNodeOptions(node.id, nodes, edges),
    })),
    receptables: receptacleNodes.map((node) => ({
      id: getUnprefixedId(node.id),
      emojiId: node.data.emojiId as string,
    })),
    meta: {
      positions: {
        step: getNodePositions(stepNodes),
        option: getNodePositions(optionNodes),
        receptacle: getNodePositions(receptacleNodes),
      },
    },
  };
}
