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

export type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
};

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type SendMessageExtra = {
  reply_markup?: InlineKeyboardMarkup;
};

export type CallbackQuery = {
  from: User;
  data?: string;
};

export type Update = {
  update_id: number;
  message?: Message;
  callback_query?: CallbackQuery;
};
