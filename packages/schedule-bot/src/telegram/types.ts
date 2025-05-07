export type TelegramResponse<T> =
  | {
      ok: true;
      result: T;
    }
  | {
      ok: false;
      description: string;
    };

export type User = {
  id: number;
};

export type Message = {
  message_id: number;
  from: User;
  text?: string;
};

export type Update = {
  update_id: number;
  message?: Message;
};
