import { describe, expect, test } from 'vitest';
import { object } from 'zod';
import { string } from 'zod/v4-mini';

import { middlewareHandler, zodSchema } from './middleware';

function request(body?: unknown): Request {
  return new Request('http://test.com', {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

test('middlewareHandler', async () => {
  const handler = middlewareHandler(
    () => 1,
    ({ data }) => [[...data], 2],
    ({ data }) => {
      return new Response(JSON.stringify(data));
    }
  );

  const response = await handler(request(), {
    env: undefined,
    params: undefined,
  });
  const actual = await response.json();

  expect(actual).toEqual([1, [[1], 2]]);
});

describe('zodSchema', () => {
  const handler = zodSchema(object({ a: string() }));

  test('ok', async () => {
    const result = await handler({ request: request({ a: '123' }) });

    expect(result).toEqual({ a: '123' });
  });

  test('error', async () => {
    const result = await handler({ request: request({ a: 123 }) });

    expect((result as Response).status).toEqual(400);
  });
});
