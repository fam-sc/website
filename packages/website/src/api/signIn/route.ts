import { badRequest, unauthrorized } from '@shared/responses';
import { verifyPassword } from '@/api/auth/password';
import { getSessionIdNumber, newSessionId, setSessionId } from '@/api/auth';
import { SignInDataSchema } from '@/api/auth/types';
import { Repository } from '@data/repo';
import { app } from '@/api/app';
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

  await using repo = await Repository.openConnection();

  const currentSessionId = getSessionIdNumber(request);
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
    return unauthrorized();
  }

  const status = await verifyPassword(user.passwordHash.buffer, password);
  if (!status) {
    return unauthrorized();
  }

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId: user._id });

  const response = new Response();
  setSessionId(response, sessionId);

  return response;
});
