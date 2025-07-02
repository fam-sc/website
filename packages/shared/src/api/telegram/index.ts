import { Message, SendMessageExtra, TelegramResponse } from './types';

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

    const tgResponse = (await response.json()) as TelegramResponse<T>;
    if (!tgResponse.ok) {
      throw new Error(
        `${tgResponse.description} when doing ${name}(${JSON.stringify(args)})`
      );
    }

    return tgResponse.result;
  }

  sendMessage(chat_id: number, text: string, extra?: SendMessageExtra) {
    return this.apiMethod<Message>('sendMessage', {
      chat_id,
      text,
      ...extra,
    });
  }

  deleteMessage(chat_id: number, message_id: number) {
    return this.apiMethod('deleteMessage', { chat_id, message_id });
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
