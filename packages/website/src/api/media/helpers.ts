import { randomUUID } from 'node:crypto';
import { putMediaFile } from '.';
import { MediaTransaction } from './transaction';

export async function putMediaFileWithUnknownId(
  pathPrefix: string,
  buffer: BodyInit,
  transaction?: MediaTransaction
): Promise<string> {
  const id = randomUUID();
  const path = `${pathPrefix}/${id}`;

  if (transaction) {
    transaction.put(path, buffer);
  } else {
    await putMediaFile(path, buffer);
  }

  return path;
}
