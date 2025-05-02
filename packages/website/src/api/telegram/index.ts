import { ChatFullInfo, File } from './types';

import { getEnvChecked } from '@/utils/env';

type TelegramResponse<T> =
  | {
      ok: true;
      result: T;
    }
  | { ok: false; description: string };

function getApiKey(): string {
  return getEnvChecked('TELEGRAM_BOT_KEY');
}

async function apiRequest<T>(
  method: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`https://api.telegram.org/bot${getApiKey()}/${method}`);
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response: ${response.statusText}`);
  }

  const responseJs = await response.json<TelegramResponse<T>>();
  if (!responseJs.ok) {
    throw new Error(responseJs.description);
  }

  return responseJs.result;
}

export function getChat(chat_id: string): Promise<ChatFullInfo> {
  return apiRequest('getChat', { chat_id });
}

export function getFile(file_id: string): Promise<File> {
  return apiRequest('getFile', { file_id });
}

export function getFileDownloadUrl(file: File): string {
  const { file_path } = file;
  if (file_path === undefined) {
    throw new Error('file_path is undefined');
  }

  return `https://api.telegram.org/file/bot${getApiKey()}/${file_path}`;
}
