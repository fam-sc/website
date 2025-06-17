import { emailRegex, telnumRegex } from '@shared/string/regex';
import { nullable, regex, string, z } from 'zod/v4-mini';

export const SignInDataSchema = z.object({
  email: string(),

  // Open text password
  password: string(),
});

export const SignUpDataSchema = z.object({
  firstName: string(),
  lastName: string(),
  parentName: nullable(string()),
  academicGroup: string(),
  email: string().check(regex(emailRegex)),
  telnum: nullable(string().check(regex(telnumRegex))),

  // Open text password
  password: string(),
});

export type SignInData = z.infer<typeof SignInDataSchema>;
export type SignUpData = z.infer<typeof SignUpDataSchema>;
