import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { NewUserEventPayload } from '@shared/api/adminbot/types';
import { TelegramBot } from '@shared/api/telegram';
import {
  CallbackQuery,
  Message,
  SendMessageExtra,
  Update,
} from '@shared/api/telegram/types';
import { deleteMessagesAcrossChats } from '@shared/api/telegram/utils';

import {
  createApproveUserCallback,
  isApproveUserCallbackByPrefix,
  parseApproveUserCallback,
} from './callback/newUser';
import { getMessage } from './messages';

type NewUserInfo = Omit<NewUserEventPayload['user'], 'registrationIp'> & {
  location: string | null;
};

export class BotController {
  private bot: TelegramBot;

  constructor(env: Env) {
    this.bot = new TelegramBot(env.BOT_KEY);
  }

  async handleUpdate(update: Update) {
    console.log(`Received update: ${JSON.stringify(update)}`);

    if (update.message !== undefined) {
      await this.handleMessage(update.message);
    } else if (update.callback_query !== undefined) {
      await this.handleCallbackQuery(update.callback_query);
    }
  }

  private async handleMessage(message: Message) {
    if (message.text !== undefined && message.text.startsWith('/start')) {
      const repo = Repository.openConnection();
      const user = await repo.users().findByAdminBotUserId(message.from.id);

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
                      url: 'https://staging.sc-fam.org/u/bot/admin',
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

  async handleAuth(userId: number) {
    await this.bot.sendMessage(userId, getMessage('success-linking'));
  }

  async handleNewUserEvent(user: NewUserInfo) {
    function createText(): string {
      const items = [
        ["Ім'я", user.firstName],
        ['Прізвище', user.firstName],
        ['По-батькові', user.firstName],
        ['Електронна пошта', user.firstName],
        ['Група', user.academicGroup],
        ['Телефон', user.telnum],
        ['IP', user.location],
      ];

      let result = `Новий користувач!\n\n`;

      result += items
        .filter(([, value]) => value !== null)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      return result;
    }

    const repo = Repository.openConnection();
    const recipients = await repo
      .users()
      .findAllUsersWithLinkedAdminBot(user.academicGroup);

    const text = createText();

    const extra: SendMessageExtra = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: getMessage('approve'),
              callback_data: createApproveUserCallback(user.id, 'approve'),
            },
            {
              text: getMessage('disapprove'),
              callback_data: createApproveUserCallback(user.id, 'disapprove'),
            },
          ],
        ],
      },
    };

    const messages = await Promise.all(
      recipients.map(({ adminBotUserId }) => {
        return this.bot.sendMessage(adminBotUserId as number, text, extra);
      })
    );

    await repo.adminBotNewUserMessages().insertMany(
      messages.map((message, index) => ({
        chatId: recipients[index].adminBotUserId as number,
        newUserId: user.id,
        messageId: message.message_id,
      }))
    );
  }

  async handleNewUserApprovedExternally(userId: number) {
    const repo = Repository.openConnection();
    const [messages] = await repo.batch([
      repo.adminBotNewUserMessages().getMessagesByNewUserId(userId),
      repo.adminBotNewUserMessages().deleteMessagesByNewUserId(userId),
    ]);

    await deleteMessagesAcrossChats(this.bot, messages);
  }

  async handleCallbackQuery(query: CallbackQuery) {
    const { data } = query;

    if (data !== undefined && isApproveUserCallbackByPrefix(data)) {
      const result = parseApproveUserCallback(data);
      if (result === null) {
        console.error('Invalid callback data');
        return;
      }

      const { userId: targetUserId, action } = result;

      const repo = Repository.openConnection();
      const originUserId = query.from.id;

      const [originUser, targetUser, targetUserMessages] = await repo.batch([
        repo.users().getRoleAndGroupByAdminBotUserId(originUserId),
        repo.users().getRoleAndGroupById(targetUserId),
        repo.adminBotNewUserMessages().getMessagesByNewUserId(targetUserId),
      ]);

      if (originUser === null) {
        console.error('Callback came from unknown user');
        return;
      }

      if (targetUser === null) {
        console.error('Unknown target user');
        return;
      }

      if (
        originUser.role < UserRole.GROUP_HEAD ||
        (originUser.role === UserRole.GROUP_HEAD &&
          originUser.academicGroup !== targetUser.academicGroup)
      ) {
        console.error('Callback came from unauthorized user');
        return;
      }

      switch (action) {
        case 'approve': {
          await repo
            .users()
            .updateRoleIfNonApprovedUser(targetUserId, UserRole.STUDENT);

          break;
        }
        case 'disapprove': {
          await repo.users().deleteWhere({ id: targetUserId }).get();

          break;
        }
      }

      await deleteMessagesAcrossChats(this.bot, targetUserMessages);
      await this.bot.sendMessage(
        originUserId,
        getMessage(action === 'approve' ? 'user-approved' : 'user-disapproved')
      );

      await repo
        .adminBotNewUserMessages()
        .deleteMessagesByNewUserId(targetUserId)
        .get();
    }
  }
}
