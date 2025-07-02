import { TelegramBot } from '.';

export async function deleteMessagesAcrossChats(
  bot: TelegramBot,
  messages: { chatId: number; messageId: number }[]
) {
  try {
    await Promise.all(
      messages.map(async ({ chatId, messageId }) => {
        return bot.deleteMessage(chatId, messageId);
      })
    );
  } catch (error: unknown) {
    console.error(error);
  }
}
