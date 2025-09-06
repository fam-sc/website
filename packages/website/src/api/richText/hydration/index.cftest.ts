import { ImageSize } from '@sc-fam/shared/image/types.js';
import { RichTextString } from '@sc-fam/shared/richText';
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { describe, expect, test } from 'vitest';

import { MediaTransaction } from '../../media/transaction';
import { hydrateRichText } from '.';

const IMAGE = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0xd, 0xa, 0x1a, 0xa, 0x0, 0x0, 0x0, 0xd, 0x49, 0x48,
  0x44, 0x52, 0x0, 0x0, 0x0, 0x2, 0x0, 0x0, 0x0, 0x2, 0x8, 0x2, 0x0, 0x0, 0x0,
  0xfd, 0xd4, 0x9a, 0x73, 0x0, 0x0, 0x0, 0x1, 0x73, 0x52, 0x47, 0x42, 0x0, 0xae,
  0xce, 0x1c, 0xe9, 0x0, 0x0, 0x0, 0x4, 0x67, 0x41, 0x4d, 0x41, 0x0, 0x0, 0xb1,
  0x8f, 0xb, 0xfc, 0x61, 0x5, 0x0, 0x0, 0x0, 0x9, 0x70, 0x48, 0x59, 0x73, 0x0,
  0x0, 0xe, 0xc3, 0x0, 0x0, 0xe, 0xc3, 0x1, 0xc7, 0x6f, 0xa8, 0x64, 0x0, 0x0,
  0x0, 0x15, 0x49, 0x44, 0x41, 0x54, 0x18, 0x57, 0x63, 0x78, 0x67, 0x64, 0xf5,
  0x56, 0x4e, 0x8d, 0x1, 0x88, 0xdf, 0xdb, 0xb9, 0x2, 0x0, 0x26, 0xc4, 0x5,
  0x2f, 0x43, 0xee, 0xb8, 0xc6, 0x0, 0x0, 0x0, 0x0, 0x49, 0x45, 0x4e, 0x44,
  0xae, 0x42, 0x60, 0x82,
]);

function testCase(
  name: string,
  block: (mediaTransaction: MediaTransaction) => Promise<void>
) {
  test(name, async () => {
    const ctx = createExecutionContext();
    await waitOnExecutionContext(ctx);

    await using mediaTransaction = new MediaTransaction(env.MEDIA_BUCKET);
    await block(mediaTransaction);
  });
}

describe('hydrateRichText', () => {
  testCase('no images', async (mediaTransaction) => {
    const input: RichTextString = { name: 'p', children: ['123'] };

    const actual = await hydrateRichText(input, {
      env,
      files: [],
      mediaTransaction,
    });

    expect(actual).toEqual(input);
  });

  testCase('unsized image not found', async (mediaTransaction) => {
    const input: RichTextString = {
      name: '#unsized-image',
      filePath: 'rich-text-image/1',
    };

    await expect(() =>
      hydrateRichText(input, {
        env,
        files: [],
        mediaTransaction,
      })
    ).rejects.toBeTruthy();
  });

  testCase('unsized image', async (mediaTransaction) => {
    const input: RichTextString = [
      '123',
      {
        name: '#unsized-image',
        filePath: 'rich-text-image/1',
      },
    ];

    const sizes: ImageSize[] = [{ width: 2, height: 4 }];

    const actual = await hydrateRichText(input, {
      env,
      files: [],
      mediaTransaction,
      previous: {
        name: '#image',
        filePath: 'rich-text-image/1',
        format: 'png',
        sizes,
      },
    });

    expect(actual).toEqual([
      '123',
      {
        name: '#image',
        filePath: 'rich-text-image/1',
        sizes,
      },
    ]);
  });

  testCase('placeholder image', async (mediaTransaction) => {
    const input: RichTextString = [
      '123',
      {
        name: '#image',
        filePath: 'rich-text-image/1',
        format: 'png',
        sizes: [{ width: 2, height: 4 }],
      },
      {
        name: '#placeholder-image',
        id: 0,
      },
    ];

    const actual = await hydrateRichText(input, {
      env,
      files: [new File([IMAGE], 'file')],
      mediaTransaction,
    });

    await mediaTransaction.commit();

    const {
      objects: [object],
    } = await env.MEDIA_BUCKET.list({ prefix: 'rich-text-image' });
    const actualImageObject = await env.MEDIA_BUCKET.get(object.key);
    const filePath = object.key.match(/(rich-text-image\/.*?)\/.+/)?.[1] ?? '';

    const actualImage = await actualImageObject?.bytes();

    expect(actual).toEqual([
      '123',
      {
        name: '#image',
        filePath: 'rich-text-image/1',
        sizes: [{ width: 2, height: 4 }],
      },
      {
        name: '#image',
        filePath,
        sizes: [{ width: 2, height: 2 }],
      },
    ]);

    expect(actualImage).toEqual(IMAGE);
  });
});
