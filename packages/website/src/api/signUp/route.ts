import { badRequest, conflict } from '@shared/responses';
import { hashPassword } from '@/api/auth/password';
import { SignUpDataSchema } from '@/api/auth/types';
import { Repository } from '@data/repo';
import { randomBytes } from '@shared/crypto/random';
import { sendConfirmationMail } from '@/api/mail/confirmation';
import { checkFacultyGroupExists } from '@/api/groups/get';
import { app } from '@/api/app';

async function newPendingToken(): Promise<string> {
  const buffer = await randomBytes(32);

  return buffer.toString('hex');
}

function createConfirmationLink(token: string): string {
  return `https://sc-fam.org/u/finish-sign-up?token=${token}`;
}

app.post('/signUp', async (request, { env }) => {
  const rawContent = await request.json();
  const signUpResult = SignUpDataSchema.safeParse(rawContent);
  if (signUpResult.error) {
    console.error(signUpResult.error);
    return badRequest();
  }

  const {
    email,
    firstName,
    lastName,
    parentName,
    academicGroup,
    telnum,
    password,
  } = signUpResult.data;

  const passwordHash = await hashPassword(password);

  const pendingToken = await newPendingToken();

  const repo = Repository.openConnection();

  const groupExists = await checkFacultyGroupExists(academicGroup);
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

  await sendConfirmationMail(
    env.RESEND_API_KEY,
    email,
    createConfirmationLink(pendingToken)
  );

  return new Response();
});
