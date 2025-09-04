import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { getEnvChecked } from '@sc-fam/shared';
import { ApiD1Database, ApiR2Bucket } from '@sc-fam/shared/cloudflare';
import { resolveImageSizes } from '@sc-fam/shared/image';
import { setDefaultDatabase } from '@sc-fam/shared-sql/repo';
import { config } from 'dotenv';
import sharp from 'sharp';

import { repository } from '@/data/repo';
import { PastMediaEntry, PastMediaEntryType } from '@/data/types';

function execFileAsync(file: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(file, args, (error, stdout) => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

function getArgs() {
  const args = process.argv.slice(2);
  const year = args[0];
  const sourcePath = args[1];

  const yearNumber = Number.parseInt(year);
  if (Number.isNaN(yearNumber)) {
    throw new TypeError('Invalid year');
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (sourcePath === undefined) {
    throw new Error('No source path');
  }

  return { year: yearNumber, sourcePath };
}

function getRemoteApi() {
  config({ path: '.env.local', quiet: true });

  return {
    db: new ApiD1Database(
      getEnvChecked('CF_D1_TOKEN'),
      getEnvChecked('CF_D1_ACCOUNT_ID'),
      getEnvChecked('CF_D1_ID')
    ),
    storage: new ApiR2Bucket(
      getEnvChecked('MEDIA_ACCOUNT_ID'),
      getEnvChecked('MEDIA_ACCESS_KEY_ID'),
      getEnvChecked('MEDIA_SECRET_ACCESS_KEY'),
      getEnvChecked('MEDIA_BUCKET_NAME')
    ),
  };
}

function getMimeTypeFromExtension(ext: string): string {
  switch (ext) {
    case 'jpeg':
    case 'webp':
    case 'png': {
      return `image/${ext}`;
    }
    // Will be transcoded to jpeg.
    case 'heic':
    case 'jpg': {
      return 'image/jpeg';
    }
    case 'mov':
    case 'mp4': {
      return 'video/mp4';
    }
    default: {
      throw new Error(`Invalid extension '${ext}'`);
    }
  }
}

async function transformContent(sourcePath: string): Promise<Buffer> {
  const buffer = await fsp.readFile(sourcePath);
  if (sourcePath.endsWith('heic')) {
    return sharp(buffer).jpeg().toBuffer();
  }

  return buffer;
}

async function migrateOriginalMedia(
  sourcePath: string,
  year: number,
  storage: ApiR2Bucket
): Promise<[string, PastMediaEntryType]> {
  const extension = path.extname(sourcePath.toLowerCase()).slice(1);
  const mimeType = getMimeTypeFromExtension(extension);
  const type = mimeType.startsWith('image')
    ? PastMediaEntryType.IMAGE
    : PastMediaEntryType.VIDEO;

  const storageId = crypto.randomUUID();
  const filePath = `${year}/${storageId}.${extension}`;

  const content = await transformContent(sourcePath);

  try {
    const entry: Partial<PastMediaEntry> = {
      path: filePath,
      type,
      year,
    };

    if (type === PastMediaEntryType.IMAGE) {
      const size = await sharp(sourcePath).metadata();

      entry.meta = JSON.stringify({
        widths: resolveImageSizes(size).map(({ width }) => width),
      });
    }

    await repository.pastMediaEntries().insert(entry);

    await storage.put(filePath, content, {
      httpMetadata: { contentType: mimeType },
    });

    return [filePath, type];
  } catch (error: unknown) {
    await repository.pastMediaEntries().deleteWhere({ path: filePath }).get();

    throw error;
  }
}

async function getVideoThumbnail(sourcePath: string) {
  const outputFileName = `./.${randomUUID()}.jpeg`;

  await execFileAsync('ffmpeg', [
    '-i',
    sourcePath,
    '-ss',
    '00:00:00',
    '-frames:v',
    '1',
    outputFileName,
  ]);

  const result = await fsp.readFile(outputFileName);

  await fsp.rm(outputFileName);

  return result;
}

async function putMultipleImages(
  sourcePath: string,
  originalPath: string,
  storage: ApiR2Bucket
) {
  const size = await sharp(sourcePath).metadata();

  const sizes = resolveImageSizes(size);

  await Promise.all(
    sizes.map(async (size) => {
      const targetContent = await sharp(sourcePath)
        .rotate()
        .resize({ ...size, kernel: 'lanczos3' })
        .toBuffer();

      const dotIndex = originalPath.lastIndexOf('.');
      const extension = originalPath.slice(dotIndex + 1);
      const targetPath = `${originalPath.slice(0, dotIndex)}.${size.width}.${extension}`;
      const mimeType = getMimeTypeFromExtension(extension);

      await storage.put(targetPath, targetContent, {
        httpMetadata: { contentType: mimeType },
      });
    })
  );
}

async function migrateEntry(
  sourcePath: string,
  year: number,
  storage: ApiR2Bucket
) {
  const [originalPath, type] = await migrateOriginalMedia(
    sourcePath,
    year,
    storage
  );

  if (type === PastMediaEntryType.IMAGE) {
    await putMultipleImages(sourcePath, originalPath, storage);
  } else {
    const thumbnail = await getVideoThumbnail(sourcePath);

    const dotIndex = originalPath.lastIndexOf('.');
    const targetPath = `${originalPath.slice(0, dotIndex)}.thumbnail.jpeg`;

    await storage.put(targetPath, thumbnail, {
      httpMetadata: { contentType: 'image/jpeg' },
    });
  }
}

async function main() {
  const { year, sourcePath } = getArgs();
  const { db, storage } = getRemoteApi();

  setDefaultDatabase(db);

  const entries = await fsp.readdir(sourcePath);

  for (const [index, entry] of entries.entries()) {
    const filePath = path.join(sourcePath, entry);

    await migrateEntry(filePath, year, storage);

    console.log(`Moved ${index}/${entries.length}`);
  }
}

void main();
