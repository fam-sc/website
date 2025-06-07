export function getCookieValue(
  input: Request | string,
  targetName: string
): string | undefined {
  let cookieValue = input;
  if (typeof cookieValue === 'object') {
    const value = cookieValue.headers.get('Cookie');
    if (value === null) {
      return undefined;
    }

    cookieValue = value;
  }

  for (const part of cookieValue.split(';')) {
    const colonIndex = part.indexOf(':');
    if (colonIndex !== -1) {
      const name = part.slice(0, colonIndex).trim();

      if (name === targetName) {
        return part.slice(colonIndex + 1).trim();
      }
    }
  }

  return undefined;
}

type CookieInfo = {
  name: string;
  value: string;
  httpOnly?: boolean;
  domain?: string;
  maxAge?: number;
  path?: string;
};

export function setCookie(request: Request | Response, info: CookieInfo) {
  const parts = [`${info.name}=${info.value}`];

  if (info.httpOnly) {
    parts.push('HttpOnly');
  }

  if (info.maxAge) {
    parts.push(`Max-Age=${info.maxAge}`);
  }

  if (info.domain) {
    parts.push(`Domain=${info.domain}`);
  }

  if (info.path) {
    parts.push(`Path=${info.path}`);
  }

  request.headers.set('Set-Cookie', parts.join('; '));
}
