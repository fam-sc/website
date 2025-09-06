import { randomUUID } from 'node:crypto';
import { loadEnvFile } from 'node:process';

import { Guide, Repository } from '@sc-fam/data';
import { getEnvChecked, textToSlug } from '@sc-fam/shared';
import { ApiD1Database, ApiR2Bucket } from '@sc-fam/shared/cloudflare';
import {
  getAttributeValue,
  getChildText,
  selectFirstNode,
} from '@sc-fam/shared/html';
import { ImageSize } from '@sc-fam/shared/image';
import {
  parseHtmlToRichText,
  RichTextAtomNode,
  RichTextNode,
} from '@sc-fam/shared/richText';
import { DefaultTreeAdapterTypes, parse } from 'parse5';
import sharp from 'sharp';

import { MediaSubPathWithImageSize } from '@/api/media/types';

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;

type ParseResult = {
  guide: Pick<Guide, 'title' | 'description'>;
  mainImageUrl: string | null;
  imageUrls: string[];
};

type ImageInfo = {
  content: Uint8Array;
  format: 'jpeg' | 'png' | 'webp';
  size: ImageSize;
};

const BASE_URL = 'https://telegra.ph';
const MAIN_IMAGE_OFFSET = 2;

function cannotFind(name: string): never {
  throw new Error(`Cannot find ${name}`);
}

function status(text: string) {
  console.log(`> ${text}`);
}

function fetchNoCache(url: string) {
  return fetch(url, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}

function repository() {
  const d1 = new ApiD1Database(
    getEnvChecked('CF_D1_TOKEN'),
    getEnvChecked('CF_D1_ACCOUNT_ID'),
    getEnvChecked('CF_D1_ID')
  );

  return new Repository(d1);
}

function r2() {
  return new ApiR2Bucket(
    getEnvChecked('MEDIA_ACCOUNT_ID'),
    getEnvChecked('MEDIA_ACCESS_KEY_ID'),
    getEnvChecked('MEDIA_SECRET_ACCESS_KEY'),
    getEnvChecked('MEDIA_BUCKET_NAME')
  );
}

async function fetchArticle(url: string): Promise<string> {
  const response = await fetchNoCache(url);

  if (!response.ok) {
    throw new Error(
      `Cannot fetch an article from ${url}: ${response.statusText}`
    );
  }

  return response.text();
}

function getArticleTitle(document: Node) {
  const header = selectFirstNode(document, 'h1');
  if (header === undefined) {
    cannotFind('header');
  }

  return getChildText(header);
}

function getArticleMainImage(mainContent: Element): string | null {
  const figure = mainContent.childNodes.at(2);

  if (figure !== undefined && figure.nodeName === 'figure') {
    const img = selectFirstNode(figure, 'img');

    if (img !== undefined) {
      const src = getAttributeValue(img, 'src');

      if (src === undefined) {
        throw new Error('Image has no source');
      }

      return `${BASE_URL}${src}`;
    }
  }

  return null;
}

function getArticleDescription(
  mainContent: Element,
  hasMainImage: boolean
): Node[] {
  const { childNodes } = mainContent;

  const result = hasMainImage
    ? childNodes.slice(MAIN_IMAGE_OFFSET + 1)
    : childNodes.slice(1);

  if (result[0].nodeName === 'address') {
    return result.slice(1);
  }

  return result;
}

async function downloadImage(url: string): Promise<ImageInfo | null> {
  try {
    const response = await fetchNoCache(url);
    if (response.ok) {
      const content = await response.bytes();
      const { width, height, format } = await sharp(content).metadata();

      switch (format) {
        case 'jpeg':
        case 'png':
        case 'webp': {
          break;
        }
        default: {
          throw new Error(`Unexpected image format: ${format}`);
        }
      }

      return { content, format, size: { width, height } };
    }
  } catch {
    // Just log the error.
  }

  status(`Cannot download image from ${url}`);
  return null;
}

async function postProcessDescription(
  node: RichTextNode,
  imageUrls: string[]
): Promise<RichTextNode> {
  function worker(node: RichTextAtomNode): Promise<RichTextAtomNode | null>;
  function worker(node: RichTextNode): Promise<RichTextNode | null>;

  async function worker(node: RichTextNode): Promise<RichTextNode | null> {
    if (Array.isArray(node)) {
      return workerArray(node);
    } else if (
      typeof node === 'string' ||
      node.name === '#image' ||
      node.name === '#unsized-image'
    ) {
      return node;
    } else if (node.name === '#placeholder-image') {
      const url = imageUrls[node.id];

      const image = await downloadImage(url);
      if (image === null) {
        return null;
      }

      const id = randomUUID();
      const filePath: MediaSubPathWithImageSize = `rich-text-image/${id}`;

      await putImageToStorage(filePath, image);

      return {
        name: '#image',
        filePath,
        format: image.format,
        sizes: [image.size],
      };
    } else {
      const newChildren = node.children
        ? await workerArray(node.children)
        : undefined;

      return {
        ...node,
        children: newChildren,
      };
    }
  }

  async function workerArray(
    nodes: RichTextAtomNode[]
  ): Promise<RichTextAtomNode[]> {
    const result = await Promise.all(nodes.map((node) => worker(node)));

    return result.filter((item) => item !== null);
  }

  return (await worker(node)) ?? [];
}

function normalizeUrl(value: string): string {
  if (value.startsWith('/')) {
    return `${BASE_URL}${value}`;
  }

  return value;
}

function telegraphArticleToGuide(content: string): ParseResult {
  const document = parse(content);

  const mainContent = selectFirstNode(document, 'article#_tl_editor');
  if (mainContent === undefined) {
    cannotFind('main content');
  }

  const title = getArticleTitle(mainContent);
  const mainImageUrl = getArticleMainImage(mainContent);
  const descriptionNodes = getArticleDescription(
    mainContent,
    mainImageUrl !== null
  );
  const { value: description, imageUrls } =
    parseHtmlToRichText(descriptionNodes);

  return {
    guide: { title, description },
    mainImageUrl,
    imageUrls: imageUrls.map((url) => normalizeUrl(url)),
  };
}

async function addToDb(guide: Omit<Guide, 'id'>) {
  return repository().guides().insertGuide(guide);
}

async function downloadMainImage(url: string) {
  const result = await downloadImage(url);
  if (result === null) {
    throw new Error('Cannot download a main image');
  }

  return result;
}

async function putImageToStorage(
  prefix: MediaSubPathWithImageSize,
  image: ImageInfo
) {
  await r2().put(`${prefix}/${image.size.width}`, image.content, {
    httpMetadata: {
      contentType: `image/${image.format}`,
    },
  });
}

async function addMainImage(guideId: number, image: ImageInfo) {
  await putImageToStorage(`guides/${guideId}`, image);
}

async function migrateArticle(url: string) {
  status('Fetching article');
  const content = await fetchArticle(url);

  status('Parsing');
  const { guide, imageUrls, mainImageUrl } = telegraphArticleToGuide(content);

  status('Downloading main image');
  const mainImage =
    mainImageUrl !== null ? await downloadMainImage(mainImageUrl) : null;

  status('Post processing');
  const newDescription = await postProcessDescription(
    guide.description,
    imageUrls
  );

  status('Adding to DB');

  const now = Date.now();
  const slug = textToSlug(guide.title);
  const guideId = await addToDb({
    title: guide.title,
    slug,
    description: newDescription,
    createdAtDate: now,
    updatedAtDate: now,
    images: mainImage
      ? { format: mainImage.format, sizes: [mainImage.size] }
      : null,
  });

  if (mainImage) {
    status('Adding main image');
    await addMainImage(guideId, mainImage);
  }

  status(`Added a guide with ID ${guideId} (${slug})`);
}

async function main() {
  loadEnvFile('.env.local');

  const url = process.argv[2];
  if (!url.startsWith(BASE_URL)) {
    throw new Error(`URL must be from ${BASE_URL}`);
  }

  await migrateArticle(url);
}

void main();
