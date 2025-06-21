type SiteverifyResponse = {
  success: boolean;
};

export async function isValidTurnstileToken(
  env: Env,
  request: Request,
  token: string
): Promise<boolean> {
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

  return outcome.success;
}
