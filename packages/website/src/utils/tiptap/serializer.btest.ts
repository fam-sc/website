import { describe, expect, test } from 'vitest';
import {
  htmlNodeToRichTextNode,
  SerializeContext,
  SerializeInternalContext,
} from './serializer';

describe('htmlNodeToRichTextNode', () => {
  const emptyContext: SerializeContext = { files: {} };
  const emptyInternalContext: SerializeInternalContext = {
    files: [],
    lastFileId: 0,
  };

  test('text node', () => {
    const text = '123';
    const node = document.createTextNode(text);

    const actual = htmlNodeToRichTextNode(
      node,
      emptyContext,
      emptyInternalContext
    );

    expect(actual).toBe(text);
  });

  test('element node', () => {
    const text = '123';
    const node = document.createElement('p');
    node.textContent = text;

    const actual = htmlNodeToRichTextNode(
      node,
      emptyContext,
      emptyInternalContext
    );

    expect(actual).toEqual({ name: 'p', children: [text] });
  });

  test('unsupported element type', () => {
    const node = document.createElement('script');

    expect(() =>
      htmlNodeToRichTextNode(node, emptyContext, emptyInternalContext)
    ).toThrowError();
  });

  test('img node', () => {
    const node = document.createElement('img');
    node.src = `${import.meta.env.VITE_MEDIA_URL}/img`;

    const actual = htmlNodeToRichTextNode(
      node,
      emptyContext,
      emptyInternalContext
    );

    expect(actual).toEqual({ name: '#unsized-image', filePath: 'img' });
  });

  test('img placeholder node', () => {
    const node = document.createElement('img');
    node.src = `blob:https://sc-fam.org/some-url`;
    const file = new File([], 'file');
    const context: SerializeContext = {
      files: { 'blob:https://sc-fam.org/some-url': file },
    };
    const internalContext: SerializeInternalContext = {
      files: [],
      lastFileId: 2,
    };

    const actual = htmlNodeToRichTextNode(node, context, internalContext);

    expect(actual).toEqual({ name: '#placeholder-image', id: 2 });
    expect(internalContext.files).toEqual([file]);
    expect(internalContext.lastFileId).toEqual(3);
  });

  test('div node', () => {
    const node = document.createElement('div');
    const child = document.createElement('p');
    child.textContent = '123';

    node.replaceChildren(child);

    const actual = htmlNodeToRichTextNode(
      node,
      emptyContext,
      emptyInternalContext
    );
    expect(actual).toEqual({
      name: 'div',
      children: [{ name: 'p', children: ['123'] }],
    });
  });

  test('comment node', () => {
    const node = document.createComment('123');

    expect(
      htmlNodeToRichTextNode(node, emptyContext, emptyInternalContext)
    ).toBeUndefined();
  });

  test('unsupported node type', () => {
    expect(() =>
      htmlNodeToRichTextNode(document, emptyContext, emptyInternalContext)
    ).toThrowError();
  });
});
