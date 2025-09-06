import { bot, TelegramBot } from 'telegram-standard-bot-api';
import { deleteMessage, getFile } from 'telegram-standard-bot-api/methods';

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

export async function getFileDownloadUrlById(
  bot: TelegramBot,
  botKey: string,
  file_id: string
): Promise<string> {
  const { file_path } = await bot(getFile({ file_id }));
  if (file_path === undefined) {
    throw new Error('No file_path');
  }

  return `https://api.telegram.org/file/bot${botKey}/${file_path}`;
}
