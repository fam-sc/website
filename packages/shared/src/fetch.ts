export type ExtendedRequestInit =
  | (RequestInit & { json?: false })
  | (Omit<RequestInit, 'body'> & {
      json: true;
      body: object;
    });

export function getJsonOrError<T>(response: Response): Promise<T> {
  return response.ok
    ? response.json()
    : Promise.reject(new Error(response.statusText));
}

export async function ensureOkResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`${response.statusText}: ${await response.text()}`);
  }
}

function encodeInitBodyToJson(
  init: ExtendedRequestInit | undefined
): RequestInit | undefined {
  if (init) {
    const { json, ...rest } = init;
    if (json) {
      const headers = new Headers(rest.headers);
      headers.set('Content-Type', 'application/json');

      return {
        ...rest,
        headers,
        body: JSON.stringify(rest.body),
      };
    }
  }

  return init;
}

export async function checkedFetch(
  url: string | URL,
  init?: ExtendedRequestInit
): Promise<Response> {
  const response = await fetch(url, encodeInitBodyToJson(init));
  await ensureOkResponse(response);

  return response;
}

export async function fetchObject<T>(
  url: string | URL,
  init?: ExtendedRequestInit
): Promise<T> {
  const response = await fetch(url, encodeInitBodyToJson(init));

  return getJsonOrError(response);
}
