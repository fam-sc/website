import { verifyAuthorizationHash } from '../../auth';
import { Repository } from '@data/repo';
import { badRequest } from '../../responses';
import { BotController } from '@/controller';
import { parseInt } from '@shared/parseInt';

export async function POST(request: Request, env: Env): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('uid');
  const telegramId = searchParams.get('tid');
  const authDate = searchParams.get('auth_date');
  const firstName = searchParams.get('first_name');
  const username = searchParams.get('username');
  const hash = searchParams.get('hash');

  if (
    telegramId === null ||
    hash === null ||
    userId === null ||
    authDate === null ||
    username === null ||
    firstName === null
  ) {
    return badRequest();
  }

  const numberUserId = parseInt(userId);
  if (numberUserId === undefined) {
    return badRequest();
  }

  const isValidHash = await verifyAuthorizationHash(
    { authDate, firstName, hash, username, userId: telegramId },
    env.BOT_KEY
  );
  if (!isValidHash) {
    return new Response('Not Authorized', { status: 401 });
  }

  const telegramIdNumber = Number.parseInt(telegramId);
  if (Number.isNaN(telegramIdNumber)) {
    return badRequest();
  }

  const repo = Repository.openConnection();

  await repo.users().updateTelegramUserId(numberUserId, telegramIdNumber);

  const controller = new BotController(env);
  await controller.handleAuth(telegramIdNumber);

  return new Response();
}

export default { POST };
