import { describe, expect, test } from 'vitest';

import { CookieInfo, getCookieValue, setCookie } from './cookies';

describe('getCookieValue', () => {
  test.each([
    ['Name=321', 'Name', '321'],
    ['Name=  321   ', 'Name', '321'],
    ['Name=123;Name2=321', 'Name2', '321'],
    ['Name', 'Name', undefined],
    ['Name2=123', 'Name', undefined],
  ])('string input', (input, name, expected) => {
    const actual = getCookieValue(input, name);

    expect(actual).toEqual(expected);
  });

  test('request with cookie', () => {
    const request = new Request('https://test.com/123');
    request.headers.set('Cookie', 'Name=123');

    const actual = getCookieValue(request, 'Name');
    expect(actual).toEqual('123');
  });

  test('request without cookie', () => {
    const request = new Request('https://test.com/123');

    const actual = getCookieValue(request, 'Name');
    expect(actual).toEqual(undefined);
  });
});

describe('setCookie', () => {
  test.each<[CookieInfo, string]>([
    [{ name: 'Name', value: '123' }, 'Name=123'],
    [{ name: 'Name', value: '123', httpOnly: true }, 'Name=123; HttpOnly'],
    [{ name: 'Name', value: '123', maxAge: 321 }, 'Name=123; Max-Age=321'],
    [
      { name: 'Name', value: '123', httpOnly: true, domain: 'some-domain' },
      'Name=123; HttpOnly; Domain=some-domain',
    ],
    [
      { name: 'Name', value: 'value', path: '/', httpOnly: true },
      'Name=value; HttpOnly; Path=/',
    ],
  ])('ok', (cookie, expected) => {
    const request = new Request('https://test.com/123');
    setCookie(request, cookie);

    const actual = request.headers.get('Set-Cookie');

    expect(actual).toEqual(expected);
  });
});
