import { Repository } from '@data/repo';
import { badRequest, unauthorized } from '@shared/responses';

import { app } from '@/api/app';
import { getSessionId, newSessionId, setSessionId } from '@/api/auth';
import { verifyPassword } from '@/api/auth/password';
import { SignInDataSchema } from '@/api/auth/schema';

import { verifyTurnstileTokenByHost } from '../turnstile/verify';

app.post('/signIn', async (request, { env }) => {
  const rawContent = await request.json();
  const signInResult = SignInDataSchema.safeParse(rawContent);
  if (signInResult.error) {
    console.error(signInResult.error);

    return badRequest({ message: 'Invalid payload' });
  }

  const { email, password, turnstileToken } = signInResult.data;

  const tokenVerification = await verifyTurnstileTokenByHost(
    env,
    request,
    turnstileToken
  );

  if (!tokenVerification.success) {
    console.error(`Token verification failed: ${tokenVerification.errorCodes}`);
    return badRequest({ message: 'Invalid turnstile token' });
  }

  const repo = Repository.openConnection();

  const currentSessionId = getSessionId(request);
  const currentSessionValid =
    currentSessionId !== undefined &&
    (await repo.sessions().sessionExists(currentSessionId));

  if (currentSessionValid) {
    return badRequest({
      message: 'Cannot create new session when you already have one',
    });
  }

  const user = await repo.users().findUserByEmail(email);
  if (user === null) {
    console.error('User not found');
    return unauthorized();
  }

  const status = await verifyPassword(user.passwordHash, password);
  if (!status) {
    console.error('Mismatched password');
    return unauthorized();
  }

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId: user.id });

  const response = new Response();
  setSessionId(response, sessionId);

  return response;
});
