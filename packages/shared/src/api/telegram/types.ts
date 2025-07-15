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

export type LoginUrl = {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
};

export type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
  login_url?: LoginUrl;
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
