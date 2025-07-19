import {
  BotFlowInMeta,
  BotFlowWithInMeta,
  BotFlowWithOutMeta,
} from '@/api/botFlow/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function fetchBotFlow(): Promise<BotFlowWithOutMeta> {
  return apiFetchObject(`/botFlow`);
}

export function updateBotFlow(value: BotFlowWithInMeta) {
  return apiCheckedFetch(`/botFlow`, {
    method: 'PUT',
    body: value,
    json: true,
  });
}

export function updateBotFlowMeta(value: BotFlowInMeta) {
  return apiCheckedFetch(`/botFlow/meta`, {
    method: 'PUT',
    body: value,
    json: true,
  });
}
