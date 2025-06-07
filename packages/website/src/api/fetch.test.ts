import { describe, expect, test, vi } from 'vitest';
import { apiCheckedFetch } from './fetch';
import { ApiErrorCode } from '@shared/api/errorCodes';
import { ApiError } from '@shared/api/error';

function callApiCheckedFetchWithFakeResponse(
  result: Response
): Promise<Response> {
  vi.stubGlobal('fetch', () => Promise.resolve(result));

  return apiCheckedFetch('');
}

describe('apiCheckedFetch', () => {
  test('ok', async () => {
    const response = new Response('123');
    const actual = await callApiCheckedFetchWithFakeResponse(response);

    await expect(actual.text()).resolves.toEqual('123');
  });

  test('error/valid', async () => {
    const message = 'Message';
    const code = ApiErrorCode.INVALID_OLD_PASSWORD;

    const response = new Response(JSON.stringify({ message, code }), {
      status: 400,
    });

    await expect(callApiCheckedFetchWithFakeResponse(response)).rejects.toEqual(
      new ApiError(message, code)
    );
  });

  test('error/ill-formatted', async () => {
    const response = new Response('Something wrong', {
      status: 400,
    });

    await expect(callApiCheckedFetchWithFakeResponse(response)).rejects.toEqual(
      new Error('Something wrong')
    );
  });
});
