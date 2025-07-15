import { bot } from 'telegram-standard-bot-api';
import { deleteMessage } from 'telegram-standard-bot-api/methods';

export async function deleteMessagesAcrossChats(
  messages: { chatId: number; messageId: number }[]
) {
  try {
    await Promise.all(
      messages.map(async ({ chatId, messageId }) => {
        return bot(deleteMessage({ chat_id: chatId, message_id: messageId }));
      })
    );
  } catch (error: unknown) {
    console.error(error);
  }
}
