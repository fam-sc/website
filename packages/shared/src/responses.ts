export type ErrorResponseBody = {
  message: string;
  code?: number;
};

function jsonResponse(value: unknown, status: number): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function helper(defaultMessage: string, status: number) {
  return (explanation?: ErrorResponseBody) =>
    jsonResponse(explanation ?? { message: defaultMessage }, status);
}

export const notFound = helper('Not Found', 404);
export const unauthorized = helper('Unauthorized', 401);
export const internalServerError = helper('Internal Server Error', 500);
export const badRequest = helper('Bad Request', 400);
export const conflict = helper('Conflict', 409);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function ok<T extends object>(value?: T): Response {
  return value === undefined ? new Response() : jsonResponse(value, 200);
}

export function methodNotAllowed(allowed?: string[]) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (allowed) {
    headers.set('Allow', allowed.join(','));
  }

  return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
    status: 405,
    headers,
  });
}

export function isErrorResponseBody(
  value: unknown
): value is ErrorResponseBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string' &&
    (!('code' in value) || typeof value.code === 'number')
  );
}
