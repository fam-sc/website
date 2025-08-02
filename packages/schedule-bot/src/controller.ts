import { Repository } from '@sc-fam/data';
import { Lesson } from '@sc-fam/shared-schedule/';
import { bot } from 'telegram-standard-bot-api';
import { sendMessage } from 'telegram-standard-bot-api/methods';
import { Message, Update } from 'telegram-standard-bot-api/types';

import { formatLessonNotification, formatMyDayLessons } from './formatter';
import { getMessage, MessageKey } from './messages';
import { getCurrentDayLessons } from './scheduleHandler';

function sendKeyedMessage(userId: number, key: MessageKey) {
  return bot(
    sendMessage({
      chat_id: userId,
      text: getMessage(key),
      parse_mode: 'MarkdownV2',
    })
  );
}

type CommandMap = Record<string, (message: Message) => Promise<void>>;
const commands: CommandMap = {
  '/start': async (message) => {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const repo = Repository.openConnection();
    const userHasLinkedBot = await repo
      .scheduleBotUsers()
      .userHasLinkedBot(fromId);

    const text = getMessage(
      userHasLinkedBot ? 'already-linked-account' : 'greeting'
    );
    const extra = !userHasLinkedBot
      ? {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Увійти',
                  login_url: {
                    url: 'https://staging.sc-fam.org/u/bot/schedule-bot',
                  },
                },
              ],
            ],
          },
        }
      : undefined;

    await bot(sendMessage({ chat_id: fromId, text, ...extra }));
  },
  '/switch': async (message) => {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const repo = Repository.openConnection();
    const newEnabled = await repo
      .scheduleBotUsers()
      .switchNotificationEnabled(fromId);

    const messageKey: MessageKey =
      newEnabled === null
        ? 'auth-required'
        : newEnabled
          ? 'notification-enabled'
          : 'notification-disabled';

    await sendKeyedMessage(fromId, messageKey);
  },
  '/myday': async (message) => {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const repo = Repository.openConnection();
    const group = await repo.scheduleBotUsers().getUserAcademicGroup(fromId);
    if (group === null) {
      await sendKeyedMessage(fromId, 'auth-required');
      return;
    }

    const lessons = await getCurrentDayLessons(group);
    if (lessons === null) {
      await sendKeyedMessage(fromId, 'no-schedule');
      return;
    }

    await bot(
      sendMessage({
        chat_id: fromId,
        text: formatMyDayLessons(lessons),
        parse_mode: 'MarkdownV2',
      })
    );
  },
};

export async function handleUpdate(update: Update) {
  console.log(`Received update: ${JSON.stringify(update)}`);

  if (update.message !== undefined) {
    await handleMessage(update.message);
  }
}

async function handleMessage(message: Message) {
  const { text } = message;
  if (text !== undefined) {
    for (const name in commands) {
      if (text.startsWith(name)) {
        await commands[name](message);

        return;
      }
    }
  }
}

export async function handleAuth(userId: number) {
  await bot(
    sendMessage({ chat_id: userId, text: getMessage('success-linking') })
  );
}

export async function handleLessonNotification(
  userId: number,
  lessons: Lesson[]
) {
  const text = formatLessonNotification(lessons);

  await bot(sendMessage({ chat_id: userId, text, parse_mode: 'MarkdownV2' }));
}
