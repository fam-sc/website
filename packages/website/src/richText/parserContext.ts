import { ParserContext } from './parser';
import { getDataUrlContent } from '@/utils/dataUrl';
import { putRawImage } from '@/api/media/putRawImage';
import { getImageSize } from '@/image/size';

export function creatMediaServerParseContext(): ParserContext {
  return {
    async parseImageToPath(dataUrl) {
      const dataContent = getDataUrlContent(dataUrl);

      const { width, height } = await getImageSize(dataContent);

      const filePath = await putRawImage('rich-text-image', dataContent);

      return { filePath, width, height };
    },
  };
}
