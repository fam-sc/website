import { checkedFetch, ExtendedRequestInit, fetchObject } from '../../fetch';

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

function url(path: string): string {
  return `https://www.googleapis.com${path}`;
}

export function fetchGoogleApiObject<T>(
  method: string,
  path: string,
  access: string,
  body?: object
): Promise<T> {
  return fetchObject(url(path), requestBody(method, access, body));
}

export function fetchGoogleApi(
  method: string,
  path: string,
  access: string,
  body?: object
) {
  return checkedFetch(url(path), requestBody(method, access, body));
}
