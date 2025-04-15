import { nullable, string, z } from 'zod';

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
  email: string(),
  telnum: nullable(string()),

  // Open text password
  password: string(),
});

export type SignInData = z.infer<typeof SignInDataSchema>;
export type SignUpData = z.infer<typeof SignUpDataSchema>;
