type SiteverifyResponse = {
  success: boolean;
  'error-codes': string[];
};

export type TurnstileVerficationResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorCodes: string[];
    };

export async function verifyTurnstileToken(
  env: Env,
  request: Request,
  token: string
): Promise<TurnstileVerficationResult> {
  const ip = request.headers.get('CF-Connecting-IP');

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const outcome = await response.json<SiteverifyResponse>();

  if (outcome.success) {
    return { success: true };
  }

  return { success: false, errorCodes: outcome['error-codes'] };
}

export async function verifyTurnstileTokenByHost(
  env: Env,
  request: Request,
  token: string | null
): Promise<TurnstileVerficationResult> {
  if (import.meta.env.VITE_HOST === 'cf') {
    if (token === null) {
      throw new Error('Token is null');
    }

    return verifyTurnstileToken(env, request, token);
  }

  return { success: true };
}
