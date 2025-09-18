import { Repository } from '@sc-fam/data';
import { Lesson } from '@sc-fam/shared-schedule/';
import { bot } from 'telegram-standard-bot-api';
import { sendMessage } from 'telegram-standard-bot-api/methods';
import { Message, Update } from 'telegram-standard-bot-api/types';

import { botRepository } from './data/repo';
import { ConversationState } from './data/types';
import { formatLessonNotification, formatMyDayLessons } from './formatter';
import { getMessage, MessageKey } from './messages';
import { getCurrentDayLessons } from './scheduleHandler';

type MessageTransformer<R> = (message: Message) => Promise<R>;
type MessageHandler = MessageTransformer<boolean | undefined>;
type CommandHandler = MessageTransformer<void>;

type CommandMap = Record<string, CommandHandler>;

function sendKeyedMessage(userId: number, key: MessageKey) {
  return bot(
    sendMessage({
      chat_id: userId,
      text: getMessage(key),
      parse_mode: 'MarkdownV2',
    })
  );
}

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
                    url: 'https://sc-fam.org/u/bot/schedule-bot',
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
    const botUser = await repo
      .scheduleBotUsers()
      .getUserAndAcademicGroup(fromId);

    if (botUser === null) {
      await sendKeyedMessage(fromId, 'auth-required');
      return;
    }

    const lessons = await getCurrentDayLessons(botUser.academicGroup);
    if (lessons === null) {
      await sendKeyedMessage(fromId, 'no-schedule');
      return;
    }

    await bot(
      sendMessage({
        chat_id: fromId,
        text: formatMyDayLessons(lessons, {
          withLessonLink: botUser.userId !== null,
        }),
        parse_mode: 'MarkdownV2',
      })
    );
  },
  '/change_group': async (message) => {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const repo = Repository.openConnection();
    const userId = await repo.scheduleBotUsers().getUserIdByTelegrmId(fromId);
    if (userId !== null) {
      await sendKeyedMessage(fromId, 'cannot-change-group');
      return;
    }

    await botRepository
      .conversations()
      .setState(fromId, ConversationState.GROUP_SELECT);

    await sendKeyedMessage(fromId, 'type-group');
  },
};

const messageHandlers: MessageHandler[] = [
  async (message) => {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const { text } = message;
    if (text?.startsWith('/')) {
      return;
    }

    const state = await botRepository.conversations().getState(fromId);
    if (state === ConversationState.GROUP_SELECT) {
      const repo = Repository.openConnection();

      const isValidGroup =
        text !== undefined && (await repo.groups().groupExists(text).get());

      if (isValidGroup) {
        await repo.scheduleBotUsers().addOrUpdateGroup(fromId, text);

        await botRepository
          .conversations()
          .setState(fromId, ConversationState.NONE);

        await sendKeyedMessage(fromId, 'success-set-initial-group');
      } else {
        await sendKeyedMessage(fromId, 'unknown-group');
      }

      return true;
    }
  },
  async (message) => {
    const { text } = message;
    if (text !== undefined) {
      if (message.from) {
        await botRepository
          .conversations()
          .setState(message.from.id, ConversationState.NONE);
      }

      for (const name in commands) {
        if (text.startsWith(name)) {
          await commands[name](message);

          return true;
        }
      }
    }
  },
];

export async function handleUpdate(update: Update) {
  console.log(`Received update: ${JSON.stringify(update)}`);

  if (update.message !== undefined) {
    await handleMessage(update.message);
  }
}

async function handleMessage(message: Message) {
  for (const handler of messageHandlers) {
    const result = await handler(message);
    if (result) {
      return;
    }
  }
}

export async function handleAuth(userId: number) {
  await bot(
    sendMessage({ chat_id: userId, text: getMessage('success-linking') })
  );
}

export async function handleLessonNotification(
  telegramId: number,
  lessons: Lesson[],
  withLessonLink: boolean
) {
  const text = formatLessonNotification(lessons, { withLessonLink });

  await bot(
    sendMessage({ chat_id: telegramId, text, parse_mode: 'MarkdownV2' })
  );
}
