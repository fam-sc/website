import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

import { putMediaFile } from '@/api/media';
import { getFileType, isValidFileSection } from '@/api/media/fileTypes';
import { isValidImage } from '@/image/validate';
import { badRequest } from '@/utils/responses';

// 10 MB
const FILE_LIMIT = 10 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  if (!isValidFileSection(section)) {
    return badRequest('Invalid section');
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > FILE_LIMIT) {
    return badRequest('Too big file');
  } else if (buffer.byteLength === 0) {
    return badRequest('Expected a file');
  }

  if (getFileType(section) === 'image') {
    const status = await isValidImage(buffer);

    if (!status) {
      return badRequest('Invalid image');
    }
  }

  const id = randomUUID();

  await putMediaFile(`${section}/${id}`, buffer);

  return new NextResponse(JSON.stringify({ id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
