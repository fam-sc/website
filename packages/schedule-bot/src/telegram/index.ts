import { TelegramResponse } from './types';

export class TelegramBot {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async apiMethod<T>(name: string, args?: unknown): Promise<T> {
    const response = await fetch(
      `https://api.telegram.org/bot${this.apiKey}/${name}`,
      {
        method: 'POST',
        body: args === undefined ? undefined : JSON.stringify(args),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }

    const tgResponse = await response.json<TelegramResponse<T>>();
    if (!tgResponse.ok) {
      throw new Error(tgResponse.description);
    }

    return tgResponse.result;
  }

  sendMessage(chat_id: number, text: string) {
    return this.apiMethod('sendMessage', {
      chat_id,
      text,
      parse_mode: 'Markdown',
    });
  }

  setWebhook(url: string, secret_token: string) {
    return this.apiMethod('setWebhook', {
      url,
      secret_token,
    });
  }

  deleteWebhook() {
    return this.apiMethod('deleteWebhook');
  }
}
