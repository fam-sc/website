import { BotFlowWithInMeta, BotFlowWithOutMeta } from '@/botFlow/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function fetchBotFlow(): Promise<BotFlowWithOutMeta> {
  return apiFetchObject(`/botFlow`);
}

export function updateBotFlow(value: BotFlowWithInMeta) {
  return apiCheckedFetch(`/botFlow`, {
    method: 'PUT',
    body: JSON.stringify(value),
  });
}
