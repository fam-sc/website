export type BotType = 'schedule' | 'admin';

export function isBotType(value: unknown): value is BotType {
  return value === 'schedule' || value === 'admin';
}
