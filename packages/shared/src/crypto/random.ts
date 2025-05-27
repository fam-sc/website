import { randomBytes as randomBytesCallback } from 'node:crypto';

export function randomBytes(size: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    randomBytesCallback(size, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer);
      }
    });
  });
}
