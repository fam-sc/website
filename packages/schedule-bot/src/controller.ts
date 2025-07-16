import { Repository } from '@data/repo';
import { Lesson } from '@shared-schedule/types';
import { bot } from 'telegram-standard-bot-api';
import { sendMessage } from 'telegram-standard-bot-api/methods';
import { Message, Update } from 'telegram-standard-bot-api/types';

import { getMessage } from './messages';

export async function handleUpdate(update: Update) {
  console.log(`Received update: ${JSON.stringify(update)}`);

  if (update.message !== undefined) {
    await handleMessage(update.message);
  }
}

async function handleMessage(message: Message) {
  if (message.text !== undefined && message.text.startsWith('/start')) {
    const fromId = message.from?.id;
    if (fromId === undefined) {
      return;
    }

    const repo = Repository.openConnection();
    const user = await repo.users().findByScheduleBotUserId(fromId);

    const isGreeting = user === null;
    const text = getMessage(isGreeting ? 'greeting' : 'already-linked-account');
    const extra = isGreeting
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
  }
}

export async function handleAuth(userId: number) {
  await bot(
    sendMessage({ chat_id: userId, text: getMessage('success-linking') })
  );
}

export async function handleTimeTrigger(userId: number, lessons: Lesson[]) {
  let text = getMessage(
    lessons.length === 1 ? 'lessons-started-singular' : 'lessons-started-plural'
  );
  text += ':\n\n';
  text += lessons
    .map((lesson) => {
      return lesson.link ? lesson.name : `[${lesson.name}](${lesson.link})`;
    })
    .join('\n');

  await bot(sendMessage({ chat_id: userId, text }));
}
