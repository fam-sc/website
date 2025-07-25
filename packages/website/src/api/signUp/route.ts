import { Repository } from '@sc-fam/data';
import { badRequest, conflict } from '@sc-fam/shared';
import { randomBytes } from '@sc-fam/shared/crypto';

import { app } from '@/api/app';
import { hashPassword } from '@/api/auth/password';
import { SignUpDataSchema } from '@/api/auth/schema';

import { sendMail } from '../mail';
import { verifyTurnstileTokenByHost } from '../turnstile/verify';
import mailHtml from './mail.html?t';
import mailText from './mail.txt?t';

async function newPendingToken(): Promise<string> {
  const buffer = await randomBytes(32);

  return buffer.toString('hex');
}

async function sendConfirmationMail(
  apiKey: string,
  recepient: string,
  token: string
) {
  const activationLink = `https://sc-fam.org/u/finish-sign-up?token=${token}`;

  await sendMail(apiKey, recepient, 'Активація облікового запису SC FAM', {
    text: mailText({ activationLink }),
    html: mailHtml({ activationLink }),
  });
}

app.post('/signUp', async (request, { env }) => {
  const rawContent = await request.json();
  const signUpResult = SignUpDataSchema.safeParse(rawContent);
  if (signUpResult.error) {
    console.error(signUpResult.error);
    return badRequest({ message: 'Invalid payload' });
  }

  const {
    email,
    firstName,
    lastName,
    parentName,
    academicGroup,
    telnum,
    password,
    turnstileToken,
  } = signUpResult.data;

  const tokenVerification = await verifyTurnstileTokenByHost(
    env,
    request,
    turnstileToken
  );

  if (!tokenVerification.success) {
    console.error(`Token verification failed: ${tokenVerification.errorCodes}`);
    return badRequest({ message: 'Invalid turnstile token' });
  }

  const passwordHash = await hashPassword(password);
  const pendingToken = await newPendingToken();

  const repo = Repository.openConnection();

  const groupExists = await repo.groups().groupExists(academicGroup).get();
  if (!groupExists) {
    return badRequest({ message: 'Unknown academic group' });
  }

  try {
    await repo.pendingUsers().insert({
      email,
      firstName,
      lastName,
      parentName,
      academicGroup,
      telnum,
      createdAt: Date.now(),
      passwordHash,
      token: pendingToken,
    });
  } catch {
    return conflict({ message: 'Email exists' });
  }

  await sendConfirmationMail(env.RESEND_API_KEY, email, pendingToken);

  return new Response();
});
