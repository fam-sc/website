import { NextRequest } from 'next/server';
import { describe, expect, test } from 'vitest';

import { POST } from './route';

function createRequest(search: string, body?: BodyInit): NextRequest {
  return new NextRequest(`https://test.com/api/uploadFile${search}`, {
    method: 'POST',
    body,
  });
}

async function expectBadRequest(response: Response, message: string) {
  const text = await response.text();

  expect(response.status).toBe(400);
  expect(text).toBe(message);
}

describe('errors', () => {
  test('invalid type section', async () => {
    const response = await POST(createRequest('?section=invalid_section'));

    await expectBadRequest(response, 'Bad request: Invalid section');
  });

  test('too big file', async () => {
    const body = new ArrayBuffer(10 * 1024 * 1024 + 1);

    const response = await POST(
      createRequest('?section=rich-text-image', body)
    );

    await expectBadRequest(response, 'Bad request: Too big file');
  });

  test('no file', async () => {
    const response = await POST(createRequest('?section=rich-text-image'));

    await expectBadRequest(response, 'Bad request: Expected a file');
  });

  test('invalid image', async () => {
    const body = new ArrayBuffer(3);
    const response = await POST(
      createRequest('?section=rich-text-image', body)
    );

    await expectBadRequest(response, 'Bad request: Invalid image');
  });
});
