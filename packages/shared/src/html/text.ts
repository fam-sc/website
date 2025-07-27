import { defaultTreeAdapter, DefaultTreeAdapterTypes } from 'parse5';

type Element = DefaultTreeAdapterTypes.Element;

export function getChildText(node: Element): string {
  const [firstChild] = node.childNodes;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (firstChild !== undefined && defaultTreeAdapter.isTextNode(firstChild)) {
    return firstChild.value;
  }

  throw new Error('First child is not text');
}
