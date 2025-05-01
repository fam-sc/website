import { ParserContext } from './parser';
import { getDataUrlContent } from '@/utils/dataUrl';
import { getImageSize } from '@/image/size';
import { MediaTransaction } from '@/api/media/transaction';
import { putMediaFileWithUnknownId } from '@/api/media/helpers';

export function creatMediaServerParseContext(
  transaction?: MediaTransaction
): ParserContext {
  return {
    async parseImageToPath(dataUrl) {
      const dataContent = getDataUrlContent(dataUrl);

      const { width, height } = await getImageSize(dataContent);

      const filePath = await putMediaFileWithUnknownId(
        'rich-text-image',
        dataContent,
        transaction
      );

      return { filePath, width, height };
    },
  };
}
