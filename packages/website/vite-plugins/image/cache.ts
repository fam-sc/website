import type { ImageSize } from '@shared/image/types';
import { isFileNotFoundError } from '../../../shared/src/errors/node';
import path from 'node:path';
import fs from 'node:fs/promises';
import { xxh3 } from '@node-rs/xxhash';
import { resizeImage } from './utils';
import { FormatEnum } from 'sharp';

type CacheEntry = {
  hash: string;
  size: ImageSize;
  cachedPath: string;
};

type FileCacheEntry = {
  hash: string;
  sizes: Record<
    string,
    | {
        cachedPath: string;
      }
    | undefined
  >;
};

type FileCacheEntryMap = Record<string, FileCacheEntry | undefined>;

export class CachedResizer implements AsyncDisposable {
  private cacheDir: string;
  private entries: FileCacheEntryMap | undefined;

  constructor(cacheDir: string) {
    this.cacheDir = path.join(cacheDir, 'sc-fam-images');
  }

  private getManifestPath(): string {
    return path.join(this.cacheDir, 'manifest.json');
  }

  private async readCacheEntries(): Promise<FileCacheEntryMap> {
    try {
      const content = await fs.readFile(this.getManifestPath(), 'utf8');

      return JSON.parse(content) as FileCacheEntryMap;
    } catch (error) {
      if (isFileNotFoundError(error)) {
        return {};
      }

      throw error;
    }
  }

  private async getCacheEntry(filePath: string, size: ImageSize) {
    if (this.entries === undefined) {
      this.entries = await this.readCacheEntries();
    }

    const entry = this.entries[filePath];

    if (entry) {
      const sizeEntry = entry.sizes[`${size.width}-${size.height}`];

      if (sizeEntry) {
        return {
          hash: entry.hash,
          cachedPath: sizeEntry.cachedPath,
        };
      }
    }

    return undefined;
  }

  private setCacheEntry(filePath: string, entry: CacheEntry) {
    if (this.entries === undefined) {
      this.entries = {};
    }

    const sizeKey = `${entry.size.width}-${entry.size.height}`;

    this.entries[filePath] = {
      hash: entry.hash,
      sizes: {
        ...this.entries[filePath]?.sizes,
        [sizeKey]: {
          cachedPath: entry.cachedPath,
        },
      },
    };
  }

  private async createCacheDir() {
    await fs.mkdir(this.cacheDir, { recursive: true });
  }

  async [Symbol.asyncDispose]() {
    await this.createCacheDir();
    await fs.writeFile(
      this.getManifestPath(),
      JSON.stringify(this.entries),
      'utf8'
    );
  }

  async resizeImageCached(
    filePath: string,
    targetSize: ImageSize,
    format: keyof FormatEnum
  ): Promise<Buffer> {
    const [entry, fileContent] = await Promise.all([
      this.getCacheEntry(filePath, targetSize),
      fs.readFile(filePath),
    ]);

    const currentHash = xxh3.xxh128(fileContent).toString(16);

    if (entry !== undefined && entry.hash === currentHash) {
      try {
        return await fs.readFile(entry.cachedPath);
      } catch {
        // Probably the file doesn't exist. Re-create it then.
      }
    }

    const resizedImage = await resizeImage(filePath, targetSize, format);

    const cachedPath = path.join(
      this.cacheDir,
      `${currentHash}-${targetSize.width}-${targetSize.height}-${path.basename(filePath)}`
    );

    await this.createCacheDir();
    await fs.writeFile(cachedPath, resizedImage);

    this.setCacheEntry(filePath, {
      cachedPath,
      hash: currentHash,
      size: targetSize,
    });

    return resizedImage;
  }
}
