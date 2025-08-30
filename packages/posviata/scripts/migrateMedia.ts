import fsp from 'node:fs/promises';
import path from 'node:path';

import { getEnvChecked } from '@sc-fam/shared';
import { ApiD1Database, ApiR2Bucket } from '@sc-fam/shared/cloudflare';
import { setDefaultDatabase } from '@sc-fam/shared-sql/repo';
import { config } from 'dotenv';
import sharp from 'sharp';

import { repository } from '@/data/repo';
import { PastMediaEntryType } from '@/data/types';

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

async function migrateFile(
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

async function main() {
  const { year, sourcePath } = getArgs();
  const { db, storage } = getRemoteApi();

  setDefaultDatabase(db);

  const entries = await fsp.readdir(sourcePath);

  for (const [index, entry] of entries.entries()) {
    const filePath = path.join(sourcePath, entry);

    await migrateFile(filePath, year, storage);

    console.log(`Moved ${index}/${entries.length}`);
  }
}

void main();
