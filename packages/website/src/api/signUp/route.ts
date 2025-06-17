import { Binary, ObjectId } from 'mongodb';
import { badRequest, conflict, internalServerError } from '@shared/responses';
import { hashPassword } from '@/api/auth/password';
import { newSessionId, setSessionId } from '@/api/auth';
import { SignUpDataSchema } from '@/api/auth/types';
import { Repository } from '@data/repo';
import { isDuplicateKeyError } from '@shared/errors/mongo';
import { randomBytes } from '@shared/crypto/random';
import { sendConfirmationMail } from '@/api/mail/confirmation';
import { checkFacultyGroupExists } from '@/api/groups/get';
import { app } from '@/api/app';

function newPendingToken(): Promise<Buffer> {
  return randomBytes(32);
}

function createConfirmationLink(token: Buffer): string {
  const tokenString = token.toString('hex');

  return `https://sc-fam.org/u/finish-sign-up?token=${tokenString}`;
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

  await using repo = await Repository.openConnection();
  let userId: ObjectId;

  const groupExists = await checkFacultyGroupExists(academicGroup);
  if (!groupExists) {
    return badRequest({ message: 'Unknown academic group' });
  }

  try {
    const result = await repo.pendingUsers().insert({
      email,
      firstName,
      lastName,
      parentName,
      academicGroup,
      telnum,
      createdAt: new Date(),
      passwordHash: new Binary(passwordHash),
      token: new Binary(pendingToken),
    });

    userId = result.insertedId;
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      return conflict({ message: 'Email exists' });
    }

    console.error(error);
    return internalServerError();
  }

  await sendConfirmationMail(
    env.RESEND_API_KEY,
    email,
    createConfirmationLink(pendingToken)
  );

  const sessionId = await newSessionId();

  await repo.sessions().insert({ sessionId, userId });

  const response = new Response(undefined, { status: 200 });
  setSessionId(response, sessionId);

  return response;
});
