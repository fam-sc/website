import { Block, BlockCollection, PageData } from './types';

const NEXT_DATA_PATTERN =
  /<script id="__NEXT_DATA__" type="application\/json">(\{.+\})<\/script>/;

export function getNextData(pageContent: string): PageData {
  const regexResult = pageContent.match(NEXT_DATA_PATTERN);

  if (regexResult === null) {
    throw new Error('Cannot find __NEXT_DATA__ script');
  }

  const dataScript = regexResult[1];

  return JSON.parse(dataScript) as PageData;
}

export function findNextDataBlock<C extends BlockCollection>(
  pageContent: string,
  collection: C
): Block<C> {
  const data = getNextData(pageContent);

  const result = data.props.pageProps.preparedBlocks.find(
    (block) => block.collection === collection
  ) as Block<C> | undefined;

  if (result === undefined) {
    throw new Error(`Cannot find ${collection} block`);
  }

  return result;
}
