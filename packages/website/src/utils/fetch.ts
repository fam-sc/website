export function getJsonOrError<T>(response: Response): Promise<T> {
  return response.ok
    ? response.json()
    : Promise.reject(new Error(response.statusText));
}

export function ensureOkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function checkedFetch(
  url: string | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(url, init);
  ensureOkResponse(response);

  return response;
}

export async function fetchObject<T>(
  url: string | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);

  return getJsonOrError(response);
}
