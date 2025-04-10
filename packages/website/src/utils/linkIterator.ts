import { urlRegex } from './regex';
import { normalizeProtocol } from './url';

export type LinkIteratorItem = string | { href: string; text: string };

export function* linkIterator(text: string): Iterable<LinkIteratorItem> {
  const regex = urlRegex();

  let result = regex.exec(text);
  if (result === null) {
    yield text;
    return;
  }

  let previousIndex = 0;

  do {
    const url = result[0];
    const startIndex = regex.lastIndex - url.length;

    const part = text.slice(previousIndex, startIndex);
    if (part.length > 0) {
      yield part;
    }

    yield { href: normalizeProtocol(url), text: url };

    previousIndex = regex.lastIndex;
  } while ((result = regex.exec(text)) !== null);

  const lastPart = text.slice(previousIndex);
  if (lastPart.length > 0) {
    yield lastPart;
  }
}
