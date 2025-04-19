import { NodeType } from '@/components/BotFlowBoard/types';

export interface BotFlow {
  steps: Step[];
  receptables: Receptacle[];
}

export interface BotFlowWithOutMeta extends BotFlow {
  meta: BotFlowOutMeta;
}

export interface BotFlowWithInMeta extends BotFlow {
  meta: BotFlowInMeta;
}

export type Position = {
  x: number;
  y: number;
};

export type PositionMap = Record<
  NodeType,
  Record<string, Position | undefined>
>;

export type BotFlowOutMeta = {
  icons: Sticker[];
  positions: PositionMap | undefined;
};

export type BotFlowInMeta = {
  positions: PositionMap;
};

export type Sticker = {
  id: string;
  source: string;
  width: number;
  height: number;
};

export type Step = {
  id: string;
  text: string;
  options: Option[];
};

export type Option = {
  id: string;
  text: string;
  nextStepId: string | null;
  receptacleId: string | null;
};

export type Receptacle = {
  id: string;
  emojiId: string;
};
