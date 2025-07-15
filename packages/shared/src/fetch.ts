export type ExtendedRequestInit =
  | (RequestInit & { json?: false })
  | (Omit<RequestInit, 'body'> & {
      json: true;
      body: object;
    });

async function createErrorResponse(response: Response): Promise<Error> {
  const { statusText: status } = response;

  try {
    const text = await response.text();

    return new Error(text.length > 0 ? `${status}: ${text}` : status);
  } catch {
    return new Error(status);
  }
}

export async function getJsonOrError<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as T;
  }

  throw await createErrorResponse(response);
}

export async function ensureOkResponse(response: Response) {
  if (!response.ok) {
    throw await createErrorResponse(response);
  }
}

export function encodeInitBodyToJson(
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
