import { randomUUID } from 'node:crypto';

import { putMediaFile } from '.';

export async function putRawImage(
  pathPrefix: string,
  buffer: BodyInit
): Promise<string> {
  const id = randomUUID();
  const path = `${pathPrefix}/${id}`;

  await putMediaFile(path, buffer);

  return path;
}
