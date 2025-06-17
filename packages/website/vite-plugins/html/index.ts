import { Plugin } from 'vite';
import fs from 'node:fs/promises';
import { minifyHTML } from './minify';

const PREFIX = 'sc-fam-html-plugin';

function extractReplacements(html: string): string[] {
  const replacements = new Set<string>();

  let offset = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const startIndex = html.indexOf('${', offset);
    if (startIndex === -1) {
      break;
    }

    const endIndex = html.indexOf('}', startIndex);
    if (endIndex === -1) {
      throw new Error('Ill-formated HTML');
    }

    replacements.add(html.slice(startIndex + 2, endIndex));
    offset = endIndex;
  }

  return [...replacements];
}

function htmlToModuleExport(html: string): string {
  const replacements = extractReplacements(html);
  let minHtml = minifyHTML(html);
  minHtml = minHtml.replaceAll('`', '\\`');

  return `export default function _({${replacements.join(',')}}) { return \`${minHtml}\` }`;
}

export function htmlPlugin(): Plugin {
  return {
    name: 'html-plugin',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source.endsWith('.html?t')) {
        const resolveId = await this.resolve(source, importer, options);

        if (resolveId === null) {
          return;
        }

        return `\0${PREFIX}${resolveId.id}`;
      }
    },
    async load(id) {
      if (id[0] === '\0' && id.startsWith(PREFIX, 1)) {
        id = id.slice(PREFIX.length + 1, id.length - '?t'.length);

        const content = await fs.readFile(id, 'utf8');

        return { code: htmlToModuleExport(content) };
      }
    },
  };
}
