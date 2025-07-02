export function getApiSecretToken(request: Request): string | null {
  return request.headers.get('x-telegram-bot-api-secret-token');
}
