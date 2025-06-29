import { Repository } from '@data/repo';
import { Lesson } from '@shared-schedule/types';

import { getMessage } from './messages';
import { TelegramBot } from './telegram';
import { Message, Update } from './telegram/types';

export class BotController {
  private bot: TelegramBot;

  constructor(env: Env) {
    this.bot = new TelegramBot(env.BOT_KEY);
  }

  private async handleMessage(message: Message) {
    if (message.text !== undefined && message.text.startsWith('/start')) {
      const repo = Repository.openConnection();
      const user = await repo.users().findByTelegramUserId(message.from.id);

      await this.bot.sendMessage(
        message.from.id,
        getMessage(user === null ? 'greeting' : 'already-linked-account')
      );
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
