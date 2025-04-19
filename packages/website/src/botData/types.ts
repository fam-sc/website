export enum ConversationState {
  CREATING_QUESTIONS = 0,
  CREATING_TITLE = 1,
  WAITING_OPERATOR = 2,
  WAITING_USER = 3,
  CLOSED = 4,
}

export type AnswerOption = {
  id: string;
  text: string;
  templated: boolean;
  next_step_id: string | null;
  receptacle_id: string | null;
  step_id: string;
};

export type Conversation = {
  id: string;
  created: Date;
  title: string;
  topic_id: number;
  owner_id: number;
  state: ConversationState;
  receptacle_id: string | null;
  step_id: string | null;
  step_message_id: number | null;
};

export type ConversationOptionHistory = {
  conversation_id: string;
  option_id: string;
  step_id: string;
};

export type MessageHistoryEntry = {
  original_id: number;
  forwarded_id: number;
  from_user: number;
  convo_id: string;
};

export type Receptacle = {
  id: string;
  announcement_text: string;
  chat_id: number;
  emoji_id: string;
  reply_text: string | null;
  text: string | null;
};

export type Step = {
  id: string;
  templated: boolean;
  text: string;
};

export type User = {
  id: number;
  authed: number;
  banned: number;
  notes: string;
};

export type Macro = {
  id: string;
  text: string;
};
