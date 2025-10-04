import { checkedFetch, ExtendedRequestInit, fetchObject } from '../../fetch';
import { rateLimitOnFetch } from '../../fetch/rateLimit.js';

function requestBody(
  method: string,
  access: string,
  body: object | undefined
): ExtendedRequestInit {
  const options: ExtendedRequestInit = body ? { body, json: true } : {};

  return {
    method,
    headers: {
      Authorization: access,
    },
    ...options,
  };
}

function url(path: string | URL): string | URL {
  return typeof path === 'string' ? `https://www.googleapis.com${path}` : path;
}

export function fetchGoogleApiObject<T>(
  method: string,
  path: string | URL,
  access: string,
  body?: object
): Promise<T> {
  return rateLimitOnFetch(() =>
    fetchObject(url(path), requestBody(method, access, body))
  );
}

export function fetchGoogleApi(
  method: string,
  path: string | URL,
  access: string,
  body?: object
) {
  return rateLimitOnFetch(() =>
    checkedFetch(url(path), requestBody(method, access, body))
  );
}
