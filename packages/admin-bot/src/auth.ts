export function isAuthorizedRequest(request: Request, env: Env): boolean {
  const authorization = request.headers.get('Authorization');

  return authorization === `Bearer ${env.ACCESS_KEY}`;
}
