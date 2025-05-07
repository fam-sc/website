import { Repository } from '@data/repo';
import { TelegramBot } from './telegram';
import { Message, Update } from './telegram/types';

export class BotController {
  private bot: TelegramBot;
  private env: Env;

  constructor(env: Env) {
    this.bot = new TelegramBot(env.BOT_KEY);
    this.env = env;
  }

  private async handleMessage(message: Message) {
    if (message.text !== undefined && message.text.startsWith('/start')) {
      await using repo = await Repository.openConnection(
        this.env.MONGO_CONNECTION_STRING
      );
      const user = await repo.users().findByTelegramUserId(message.from.id);

      await (user === null
        ? this.bot.sendMessage(
            message.from.id,
            `Вітаємо!\n\nДля того, щоб користуватися цим ботом потрібно прив'язати ваш телеграм аккаунт до облікового запису SC FAM\n\nhttps://sc-fam.org/u/telegram-auth`
          )
        : this.bot.sendMessage(
            message.from.id,
            `У вас вже прив'язаний аккаунт`
          ));
    }
  }

  async handleUpdate(update: Update) {
    console.log(`Received update: ${JSON.stringify(update)}`);

    if (update.message !== undefined) {
      await this.handleMessage(update.message);
    }
  }
}
