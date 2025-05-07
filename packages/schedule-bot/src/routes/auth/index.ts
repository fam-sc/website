import { verifyAuthorizationHash } from '../../auth';
import { Repository } from '@data/repo';
import { ObjectId } from 'mongodb';
import { badRequest } from '../../responses';

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

  let objectUserId: ObjectId;
  try {
    objectUserId = new ObjectId(userId);
  } catch {
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

  await using repo = await Repository.openConnection(
    env.MONGO_CONNECTION_STRING
  );
  await repo.users().updateTelegramUserId(objectUserId, telegramIdNumber);

  return new Response();
}

export default { POST };
