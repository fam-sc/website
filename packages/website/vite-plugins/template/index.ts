import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import { minifyHTML } from './minify';

const PREFIX = 'sc-fam-text-template-plugin';

type ContentType = 'text' | 'html';

function extractReplacements(content: string): string[] {
  const replacements = new Set<string>();

  let offset = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const startIndex = content.indexOf('${', offset);
    if (startIndex === -1) {
      break;
    }

    const endIndex = content.indexOf('}', startIndex);
    if (endIndex === -1) {
      throw new Error('Ill-formated template');
    }

    replacements.add(content.slice(startIndex + 2, endIndex));
    offset = endIndex;
  }

  return [...replacements];
}

function contentToModuleExport(content: string, type: ContentType): string {
  const replacements = extractReplacements(content);
  let minHtml = content;

  if (type === 'html') {
    minHtml = minifyHTML(content);
  }

  minHtml = minHtml.replaceAll('`', '\\`');

  return `export default function _({${replacements.join(',')}}) { return \`${minHtml}\` }`;
}

export function templatePlugin(): Plugin {
  return {
    name: 'text-template-plugin',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source.endsWith('.html?t') || source.endsWith('.txt?t')) {
        const resolveId = await this.resolve(source, importer, options);

        if (resolveId !== null) {
          return `\0${PREFIX}${resolveId.id}`;
        }
      }
    },
    async load(id) {
      if (id[0] === '\0' && id.startsWith(PREFIX, 1)) {
        id = id.slice(PREFIX.length + 1, id.length - '?t'.length);

        const content = await fs.readFile(id, 'utf8');
        const contentType = id.endsWith('.txt') ? 'text' : 'html';

        return { code: contentToModuleExport(content, contentType) };
      }
    },
  };
}
