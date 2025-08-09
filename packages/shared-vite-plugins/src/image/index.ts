import path from 'node:path';

import {
  getTargetSize,
  ImageSize,
  resolveImageWidths,
} from '@sc-fam/shared/image';
import sharp, { FormatEnum } from 'sharp';
import { Plugin, ResolvedConfig } from 'vite';

import { CachedResizer } from './cache';
import { MetaEntry, withWidth } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type PluginContext = ThisParameterType<Extract<Plugin['resolveId'], Function>>;

type IdType =
  | {
      type: 'multiple';
      id: string;
    }
  | {
      type: 'w';
      id: string;
      width: number;
    };

const imageMultipleExtensions = ['.png', '.jpg', '.jpeg', '.webp'].map(
  (ext) => `${ext}?multiple`
);
const imageWidthRegex = /^(.+\.(?:jpe?g|png|webp))\?w=(\d+)!$/gi;

function parseId(id: string): IdType | undefined {
  if (imageMultipleExtensions.some((ext) => id.endsWith(ext))) {
    return {
      type: 'multiple',
      id: id.slice(0, id.length - '?mutliple'.length),
    };
  }

  const regexResult = id.matchAll(imageWidthRegex);
  const groups = regexResult.next().value;
  if (groups !== undefined) {
    return {
      type: 'w',
      id: groups[1],
      width: Number.parseInt(groups[2]),
    };
  }

  return undefined;
}

function rollupFileUrl(id: string): string {
  return `import.meta.ROLLUP_FILE_URL_${id}`;
}

async function emitResizedImage(
  pluginContext: PluginContext,
  resizer: CachedResizer,
  id: string,
  size: ImageSize,
  format: keyof FormatEnum
) {
  const content = await resizer.resizeImageCached(id, size, format);

  const resultId = pluginContext.emitFile({
    type: 'asset',
    name: path.basename(withWidth(id, size.width)),
    source: content,
  });

  return rollupFileUrl(resultId);
}

function getDevUrl(id: string): string {
  id = path.resolve(id);

  const baseUrl = path.resolve('.');
  if (!id.startsWith(baseUrl)) {
    throw new Error("Invalid ID: it doesn' start with package base path");
  }

  let resultUrl = id.slice(baseUrl.length);
  resultUrl = resultUrl.replaceAll('\\', '/');
  resultUrl = `'${resultUrl}'`;

  return resultUrl;
}

async function idToJsImageEntry(
  id: string,
  targetWidth: number,
  metaEntry: MetaEntry,
  resizer: CachedResizer,
  config: ResolvedConfig,
  pluginContext: PluginContext
): Promise<string> {
  let resultUrl: string;
  let resultSize: ImageSize;

  if (config.command === 'serve') {
    resultUrl = getDevUrl(id);

    resultSize = metaEntry;
  } else {
    resultSize = getTargetSize(metaEntry, targetWidth);

    resultUrl = await emitResizedImage(
      pluginContext,
      resizer,
      id,
      resultSize,
      metaEntry.format
    );
  }

  return `{src:${resultUrl},width:${resultSize.width},height:${resultSize.height}}`;
}

async function idToWidthImageEntry(
  id: string,
  targetWidth: number,
  metaEntry: MetaEntry,
  resizer: CachedResizer,
  config: ResolvedConfig,
  pluginContext: PluginContext
) {
  return config.command === 'serve'
    ? getDevUrl(id)
    : emitResizedImage(
        pluginContext,
        resizer,
        id,
        getTargetSize(metaEntry, targetWidth),
        metaEntry.format
      );
}

export function imagePlugin(): Plugin[] {
  let config: ResolvedConfig;
  let resizer: CachedResizer;

  return [
    {
      name: 'image-plugin:build',
      enforce: 'pre',
      configResolved(_config) {
        config = _config;
      },
      buildStart() {
        resizer = new CachedResizer(config.cacheDir);
      },
      async buildEnd() {
        await resizer[Symbol.asyncDispose]();
      },
      async load(id) {
        if (id[0] === '\0') {
          // Rollup convention, this id should be handled by the
          // plugin that marked it with \0
          return;
        }

        const parseResult = parseId(id);
        if (!parseResult) {
          return;
        }

        id = parseResult.id;

        const meta = await sharp(id).metadata();

        if (parseResult.type == 'multiple') {
          const sizes = resolveImageWidths(meta.width);

          const parts = await Promise.all(
            sizes.map((targetWidth) =>
              idToJsImageEntry(id, targetWidth, meta, resizer, config, this)
            )
          );

          return {
            code: `export default [${parts.join(',')}];`,
          };
        } else {
          const exportCode = await idToWidthImageEntry(
            id,
            parseResult.width,
            meta,
            resizer,
            config,
            this
          );

          return {
            code: `export default ${exportCode}`,
          };
        }
      },
      resolveFileUrl({ fileName }) {
        return `"/${fileName}"`;
      },
      generateBundle(_, bundle) {
        // do not emit assets for SSR build
        if (
          config.command === 'build' &&
          !this.environment.config.build.emitAssets
        ) {
          for (const file in bundle) {
            if (
              bundle[file].type === 'asset' &&
              !file.endsWith('ssr-manifest.json')
            ) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete bundle[file];
            }
          }
        }
      },
    },
  ];
}
