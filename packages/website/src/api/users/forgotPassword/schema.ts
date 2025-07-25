import { emailRegex } from '@sc-fam/shared/string';
import { nullable, object, regex, string } from 'zod/v4-mini';

const turnstileToken =
  import.meta.env.VITE_HOST === 'cf' ? string() : nullable(string());

export const forgotPasswordPayload = object({
  email: string().check(regex(emailRegex)),
  turnstileToken,
});
