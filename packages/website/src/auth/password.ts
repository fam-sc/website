import { hash, Options, verify } from '@node-rs/argon2';

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
const options: Options = {
  // Algorithm.Argon2id
  algorithm: 2,
  memoryCost: 7168,
  timeCost: 5,
  parallelism: 1,
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, options);
}

export function verifyPassword(
  hashed: string,
  password: string
): Promise<boolean> {
  return verify(hashed, password, options);
}
