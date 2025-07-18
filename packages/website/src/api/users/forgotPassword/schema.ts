import { emailRegex } from '@shared/string/regex';
import { nullable, object, regex, string } from 'zod/v4-mini';

const turnstileToken =
  import.meta.env.VITE_HOST === 'cf' ? string() : nullable(string());

export const forgotPasswordPayload = object({
  email: string().check(regex(emailRegex)),
  turnstileToken,
});
