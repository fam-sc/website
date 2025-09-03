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
import { PastMediaEntryType } from '@/data/types';

type Phase = 'original-image' | 'opt-image' | 'video-thumbnail';

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

async function migrateOriginalImage(
  sourcePath: string,
  year: number,
  storage: ApiR2Bucket
) {
  const extension = path.extname(sourcePath.toLowerCase()).slice(1);
  const mimeType = getMimeTypeFromExtension(extension);
  const type = mimeType.startsWith('image')
    ? PastMediaEntryType.IMAGE
    : PastMediaEntryType.VIDEO;

  const storageId = crypto.randomUUID();
  const filePath = `${year}/${storageId}.${extension}`;

  const content = await transformContent(sourcePath);

  try {
    await repository.pastMediaEntries().insert({
      path: filePath,
      type,
      year,
    });

    await storage.put(filePath, content, {
      httpMetadata: { contentType: mimeType },
    });
  } catch (error: unknown) {
    await repository.pastMediaEntries().deleteWhere({ path: filePath }).get();

    throw error;
  }
}

async function getVideoThumbnail(buffer: Uint8Array) {
  const inputFileName = `./.${randomUUID()}`;
  const outputFileName = `./.${randomUUID()}.jpeg`;
  await fsp.writeFile(inputFileName, buffer);

  await execFileAsync('ffmpeg', [
    '-i',
    inputFileName,
    '-ss',
    '00:00:00',
    '-frames:v',
    '1',
    outputFileName,
  ]);

  const result = await fsp.readFile(outputFileName);

  await fsp.rm(inputFileName);
  await fsp.rm(outputFileName);

  return result;
}

async function putMultipleImagesFromDb(storage: R2Bucket) {
  const entries = await repository
    .pastMediaEntries()
    .findManyWhere({ type: PastMediaEntryType.IMAGE });

  for (const entry of entries) {
    try {
      const object = await storage.get(entry.path);
      const content = await object?.bytes();
      if (!content) {
        console.error('No content', entry.id);
        continue;
      }

      const { width, height } = await sharp(content).metadata();

      const sizes = resolveImageSizes({ width, height });

      await Promise.all(
        sizes.map(async (size) => {
          const targetContent = await sharp(content)
            .rotate()
            .resize({ ...size, kernel: 'lanczos3' })
            .toBuffer();

          const dotIndex = entry.path.lastIndexOf('.');
          const extension = entry.path.slice(dotIndex + 1);
          const targetPath = `${entry.path.slice(0, dotIndex)}.${size.width}.${extension}`;
          const mimeType = getMimeTypeFromExtension(extension);

          await storage.put(targetPath, targetContent, {
            httpMetadata: { contentType: mimeType },
          });
        })
      );

      await repository
        .pastMediaEntries()
        .updateWhere(
          { id: entry.id },
          { meta: JSON.stringify({ widths: sizes.map(({ width }) => width) }) }
        );

      console.log('> Migrated', entry.path);
    } catch (error: unknown) {
      console.error('Error while migrating', entry.id, error);
    }
  }
}

async function main() {
  // const { year, sourcePath } = getArgs();
  const { db, storage } = getRemoteApi();

  setDefaultDatabase(db);

  await putMultipleImagesFromDb(storage);

  // const entries = await fsp.readdir(sourcePath);

  // for (const [index, entry] of entries.entries()) {
  //   const filePath = path.join(sourcePath, entry);
  //
  //   await migrateOriginalImage(filePath, year, storage);
  //
  //   console.log(`Moved ${index}/${entries.length}`);
  // }
}

void main();
