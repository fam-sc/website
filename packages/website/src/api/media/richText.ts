import { getImageSize } from '@shared/image/size';
import { ParserContext } from '@shared/richText/parser';
import { getDataUrlContent } from '@shared/dataUrl';
import { randomUUID } from 'node:crypto';

export function creatMediaServerParseContext(
  put: (path: string, body: Buffer) => void | Promise<void>
): ParserContext {
  return {
    async parseImageToPath(dataUrl) {
      const dataContent = getDataUrlContent(dataUrl);

      const size = getImageSize(dataContent);

      const id = randomUUID();
      const path = `rich-text-image/${id}`;

      await put(path, dataContent);

      return { filePath: path, ...size };
    },
  };
}
