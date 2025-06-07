import { encodeInitBodyToJson, ExtendedRequestInit } from '@shared/fetch';
import { isErrorResponseBody } from '@shared/responses';
import { ApiError } from '@shared/api/error';
import { getEnvChecked } from '@shared/env';

export async function getApiErrorFromResponse(
  response: Response
): Promise<Error> {
  const text = await response.text();
  let object: unknown;

  try {
    object = JSON.parse(text);
  } catch {
    // Here we only handling the case when response body is not valid JSON.
  }

  return isErrorResponseBody(object)
    ? new ApiError(object.message, object.code)
    : new Error(text);
}

function getApiUrl(): string {
  return getEnvChecked('NEXT_PUBLIC_API_URL');
}

export async function apiFetch(url: string | URL, init?: ExtendedRequestInit) {
  return fetch(`${getApiUrl()}${url}`, encodeInitBodyToJson(init));
}

export async function apiCheckedFetch(
  url: string | URL,
  init?: ExtendedRequestInit
): Promise<Response> {
  const response = await apiFetch(url, init);
  if (!response.ok) {
    throw await getApiErrorFromResponse(response);
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
