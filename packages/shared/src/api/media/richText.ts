import { getDataUrlContent } from '../../dataUrl';
import { getImageSize } from '../../image/size';
import { ParserContext } from '../../richText/parser';
import { putMediaFileWithUnknownId } from './helpers';
import { MediaTransaction } from './transaction';

export function creatMediaServerParseContext(
  transaction?: MediaTransaction
): ParserContext {
  return {
    async parseImageToPath(dataUrl) {
      const dataContent = getDataUrlContent(dataUrl);

      const size = getImageSize(dataContent);

      const filePath = await putMediaFileWithUnknownId(
        'rich-text-image',
        dataContent,
        transaction
      );

      return { filePath, ...size };
    },
  };
}
