import { Repository } from '@sc-fam/data';
import { badRequest, unauthorized } from '@sc-fam/shared';
import { middlewareHandler, zodSchema } from '@sc-fam/shared/router';

import { app } from '@/api/app';
import { getSessionId, newSessionId, setSessionId } from '@/api/auth';
import { verifyPassword } from '@/api/auth/password';
import { SignInDataSchema } from '@/api/auth/schema';

import { verifyTurnstileTokenByHost } from '../turnstile/verify';

app.post(
  '/signIn',
  middlewareHandler(
    zodSchema(SignInDataSchema),
    async ({ request, env, data: [payload] }) => {
      const { email, password, turnstileToken } = payload;

      const tokenVerification = await verifyTurnstileTokenByHost(
        env,
        request,
        turnstileToken
      );

      if (!tokenVerification.success) {
        console.error(
          `Token verification failed: ${tokenVerification.errorCodes}`
        );
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

      const user = await repo.users().findUserWithPasswordByEmail(email);
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
    }
  )
);
