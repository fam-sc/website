import { getImageSize } from '@shared/image/size';
import { ParserContext } from '@shared/richText/parser';
import { getDataUrlContent } from '@shared/dataUrl';
import { randomUUID } from 'node:crypto';
import { MediaTransaction } from './transaction';

export function creatMediaServerParseContext(
  mediaTransaction: MediaTransaction
): ParserContext {
  return {
    parseImageToPath(dataUrl) {
      const dataContent = getDataUrlContent(dataUrl);

      const size = getImageSize(dataContent);

      const id = randomUUID();
      const path = `rich-text-image/${id}`;

      mediaTransaction.put(path, dataContent);

      return { filePath: path, ...size };
    },
  };
}
