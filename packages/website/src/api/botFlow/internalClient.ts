import { checkedFetch, fetchObject } from '@shared/fetch';

import { BotFlowConfig, botFlowConfig } from './types';

const CONFIG_URL = 'https://bot.sc-fam.workers.dev/config';

function authorization(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
  };
}

export async function getInternalBotFlowConfig(
  apiKey: string
): Promise<BotFlowConfig> {
  const result = await fetchObject(CONFIG_URL, {
    headers: authorization(apiKey),
  });

  return botFlowConfig.parse(result);
}

export async function putInternalBotFlowConfig(
  apiKey: string,
  config: BotFlowConfig
) {
  return checkedFetch(CONFIG_URL, {
    method: 'PUT',
    headers: authorization(apiKey),
    body: config,
    json: true,
  });
}
