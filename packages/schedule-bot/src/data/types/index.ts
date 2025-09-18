export const enum ConversationState {
  NONE = 0,
  GROUP_SELECT = 1,
}

export type Conversation = {
  telegramId: number;
  state: ConversationState;
};
