import { randomUUID } from 'node:crypto';

import { putMediaFile } from '.';

import { isValidImage } from '@/image/validate';
import { getDataUrlContent } from '@/utils/dataUrl';

export async function putRawImage(
  pathPrefix: string,
  dataUrl: string
): Promise<string> {
  const content = getDataUrlContent(dataUrl);
  if (!(await isValidImage(content))) {
    throw new Error('Invalid image');
  }

  const id = randomUUID();
  const path = `${pathPrefix}/${id}`;

  await putMediaFile(path, content);

  return path;
}
