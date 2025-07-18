import { emailRegex, telnumRegex } from '@shared/string/regex';
import { nullable, object, regex, string } from 'zod/v4-mini';

const turnstileToken =
  import.meta.env.VITE_HOST === 'cf' ? string() : nullable(string());

export const SignInDataSchema = object({
  email: string(),

  // Open text password
  password: string(),
  turnstileToken,
});

export const SignUpDataSchema = object({
  firstName: string(),
  lastName: string(),
  parentName: nullable(string()),
  academicGroup: string(),
  email: string().check(regex(emailRegex)),
  telnum: nullable(string().check(regex(telnumRegex))),

  // Open text password
  password: string(),
  turnstileToken,
});
