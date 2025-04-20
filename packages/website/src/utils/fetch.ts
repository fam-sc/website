export function getJsonOrError<T>(response: Response): Promise<T> {
  return response.ok
    ? (response.json() as Promise<T>)
    : Promise.reject(new Error(response.statusText));
}

export function ensureOkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function fetchObject<T>(
  url: string | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);

  return getJsonOrError(response);
}
