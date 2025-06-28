export function hash(
  data: string,
  hashId: string = 'SHA-256'
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  return crypto.subtle.digest(hashId, dataBuffer);
}

export async function verifyHmac(
  key: ArrayBuffer,
  data: string,
  signed: BufferSource,
  hash: string = 'SHA-256'
): Promise<boolean> {
  const encoder = new TextEncoder();

  const dataBuffer = encoder.encode(data);

  const params: HmacImportParams = { name: 'HMAC', hash };

  const cryptoKey = await crypto.subtle.importKey('raw', key, params, false, [
    'verify',
  ]);

  return crypto.subtle.verify(params, cryptoKey, signed, dataBuffer);
}
