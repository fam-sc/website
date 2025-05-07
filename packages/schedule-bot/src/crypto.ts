import { parseHexString } from './hex';

export async function verifyHmac(
  key: string,
  data: string,
  signedHex: string
): Promise<boolean> {
  const encoder = new TextEncoder();

  const signedBuffer = parseHexString(signedHex);

  const keyBuffer = encoder.encode(key);
  const dataBuffer = encoder.encode(data);

  const params: HmacImportParams = { name: 'HMAC', hash: 'SHA-256' };

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    params,
    false,
    ['verify']
  );

  return crypto.subtle.verify(params, cryptoKey, signedBuffer, dataBuffer);
}
