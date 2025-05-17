import { encodeInitBodyToJson, ExtendedRequestInit } from '@shared/fetch';
import { ErrorResponseBody } from './responses';
import { ApiError } from './error';

export async function apiCheckedFetch(
  url: string | URL,
  init?: ExtendedRequestInit
): Promise<Response> {
  const response = await fetch(url, encodeInitBodyToJson(init));
  if (!response.ok) {
    const text = await response.text();
    let object: ErrorResponseBody | undefined;

    try {
      object = JSON.parse(text) as ErrorResponseBody;
    } catch {
      // Here we only handling the case when response body is not valid JSON.
    }

    const error = object
      ? new ApiError(object.message, object.code)
      : new Error(text);

    throw error;
  }

  return response;
}

export async function apiFetchObject<T>(
  url: string | URL,
  init?: ExtendedRequestInit
): Promise<T> {
  const response = await apiCheckedFetch(url, init);

  return (await response.json()) as T;
}
