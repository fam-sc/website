const ITERATIONS = 100_000;
const SALT_LENGTH = 16;

function generateSalt(): Uint8Array {
  const result = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(result);

  return result;
}

async function hashPasswordBase(
  password: string,
  salt: Uint8Array
): Promise<Uint8Array> {
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

  return new Uint8Array(derivation);
}

export async function hashPassword(password: string): Promise<Uint8Array> {
  const salt = generateSalt();

  const hash = await hashPasswordBase(password, salt);

  return new Uint8Array([...salt, ...hash]);
}

function isSameBuffers(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length === b.length) {
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export async function verifyPassword(
  hashed: Uint8Array,
  password: string
): Promise<boolean> {
  const salt = hashed.slice(0, SALT_LENGTH);
  const actual = await hashPasswordBase(password, salt);
  const expected = hashed.slice(SALT_LENGTH);

  return isSameBuffers(expected, actual);
}
