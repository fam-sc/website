import { Repository } from '@sc-fam/data';
import { badRequest, unauthorized } from '@sc-fam/shared';
import { randomBytes } from '@sc-fam/shared/crypto';

import { app } from '@/api/app';
import { sendMail } from '@/api/mail';
import { verifyTurnstileTokenByHost } from '@/api/turnstile/verify';

import mailHtml from './assets/mail.html?t';
import mailText from './assets/mail.txt?t';
import { forgotPasswordPayload } from './schema';

// 10 minutes
const EXPIRATION_DURATION = 10 * 60 * 1000;

async function newConfirmationToken(): Promise<string> {
  const buffer = await randomBytes(32);

  return buffer.toString('hex');
}

async function sendConfirmationMail(
  apiKey: string,
  recepient: string,
  token: string
) {
  const activationLink = `https://sc-fam.org/forgot-password/success?token=${token}`;

  await sendMail(apiKey, recepient, 'Зміна паролю облікового запису SC FAM', {
    text: mailText({ activationLink }),
    html: mailHtml({ activationLink }),
  });
}

app.post('/users/forgotPassword', async (request, { env }) => {
  const rawPayload = await request.json();
  const payloadResult = forgotPasswordPayload.safeParse(rawPayload);

  if (!payloadResult.success) {
    return badRequest();
  }

  const { email, turnstileToken } = payloadResult.data;
  const tokenVerification = await verifyTurnstileTokenByHost(
    env,
    request,
    turnstileToken
  );

  if (!tokenVerification.success) {
    console.error(`Token verification failed: ${tokenVerification.errorCodes}`);

    return unauthorized();
  }

  const token = await newConfirmationToken();
  const repo = Repository.openConnection();

  if (await repo.users().userWithEmailExists(email)) {
    await repo.forgotPasswordEntries().insert({
      token,
      email,
      expirationDate: Date.now() + EXPIRATION_DURATION,
    });

    await sendConfirmationMail(env.RESEND_API_KEY, email, token);
  }

  return new Response();
});
