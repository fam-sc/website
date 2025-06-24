import { parseHexString, toHexString } from '@shared/string/hex';

const ITERATIONS = 600_000;
const SALT_LENGTH = 16;

function generateSalt(): Uint8Array {
  const result = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(result);

  return result;
}

async function hashPasswordBase(
  password: string,
  salt: Uint8Array
): Promise<string> {
  const textEncoder = new TextEncoder();
  const passwordBuffer = textEncoder.encode(password);
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const params = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt,
    iterations: ITERATIONS,
  };
  const derivation = await crypto.subtle.deriveBits(
    params,
    importedKey,
    32 * 8
  );

  return toHexString([...new Uint8Array(derivation)]);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();

  const hash = await hashPasswordBase(password, salt);

  return `${toHexString([...salt])}${hash}`;
}

export async function verifyPassword(
  hashed: string,
  password: string
): Promise<boolean> {
  const salt = parseHexString(hashed.slice(0, SALT_LENGTH));
  const actual = await hashPasswordBase(password, salt);
  const expected = hashed.slice(SALT_LENGTH);

  return actual === expected;
}
