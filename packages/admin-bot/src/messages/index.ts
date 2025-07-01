import messages from './messages.json';

export type MessageKey = keyof typeof messages;

export function getMessage(key: MessageKey): string {
  return messages[key];
}
