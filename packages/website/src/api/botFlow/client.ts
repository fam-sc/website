import { fetchObject } from '@shared/fetch';

import { BotFlowWithInMeta, BotFlowWithOutMeta } from '@/botFlow/types';

export function fetchBotFlow(): Promise<BotFlowWithOutMeta> {
  return fetchObject(`/api/botFlow`);
}

export function updateBotFlow(
  value: BotFlowWithInMeta
): Promise<BotFlowWithInMeta> {
  return fetchObject(`/api/botFlow`, {
    method: 'PUT',
    body: JSON.stringify(value),
  });
}
