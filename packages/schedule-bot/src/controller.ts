import { Repository } from '@data/repo';
import { TelegramBot } from '@shared/api/telegram';
import { Message, Update } from '@shared/api/telegram/types';
import { Lesson } from '@shared-schedule/types';

import { getMessage } from './messages';

export class BotController {
  private bot: TelegramBot;

  constructor(env: Env) {
    this.bot = new TelegramBot(env.BOT_KEY);
  }

  private async handleMessage(message: Message) {
    if (message.text !== undefined && message.text.startsWith('/start')) {
      const repo = Repository.openConnection();
      const user = await repo.users().findByScheduleBotUserId(message.from.id);

      const isGreeting = user === null;
      const text = getMessage(
        isGreeting ? 'greeting' : 'already-linked-account'
      );
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

      await this.bot.sendMessage(message.from.id, text, extra);
    }
  }

  async handleUpdate(update: Update) {
    console.log(`Received update: ${JSON.stringify(update)}`);

    if (update.message !== undefined) {
      await this.handleMessage(update.message);
    }
  }

  async handleAuth(userId: number) {
    await this.bot.sendMessage(userId, getMessage('success-linking'));
  }

  async handleTimeTrigger(userId: number, lessons: Lesson[]) {
    let message = getMessage(
      lessons.length === 1
        ? 'lessons-started-singular'
        : 'lessons-started-plural'
    );
    message += ':\n\n';
    message += lessons
      .map((lesson) => {
        return lesson.link ? lesson.name : `[${lesson.name}](${lesson.link})`;
      })
      .join('\n');

    await this.bot.sendMessage(userId, message);
  }
}
