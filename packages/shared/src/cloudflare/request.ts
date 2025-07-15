export function getConnectingIp(request: Request): string | null {
  return request.headers.get('CF-Connecting-IP');
}
