import { BotFlowWithInMeta, BotFlowWithOutMeta } from '@/botFlow/types';
import { fetchObject } from '@/utils/fetch';

export function fetchBotFlow(): Promise<BotFlowWithOutMeta> {
  return fetchObject(`/api/botFlow`, { method: 'GET' });
}

export function updateBotFlow(
  value: BotFlowWithInMeta
): Promise<BotFlowWithInMeta> {
  return fetchObject(`/api/botFlow`, {
    method: 'POST',
    body: JSON.stringify(value),
  });
}
