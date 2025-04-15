import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

import { fetchMediaFile, putMediaFile } from '@/api/media';
import { MediaFileHeaders } from '@/api/media/headers';
import { notFound } from '@/api/responses';
import { getChat, getFile, getFileDownloadUrl } from '@/api/telegram';
import { isTelegramUrl, urlToChatId } from '@/api/telegram/utils';
import { Repository } from '@/data/repo';

// One day
const INVALIDATE_TIME = 24 * 60 * 60 * 1000;

// Downloads chat image specified by t.me link.
async function downloadChatImage(href: string): Promise<ArrayBuffer> {
  const channelId = urlToChatId(href);

  const chat = await getChat(channelId);
  const file = await getFile(chat.photo.big_file_id);
  const fileUrl = getFileDownloadUrl(file);

  const response = await fetch(fileUrl);
  if (response.ok) {
    const buffer = await response.arrayBuffer();

    return buffer;
  }

  throw new Error(response.statusText);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  await using repo = await Repository.openConnection();
  const link = await repo.usefulLinks().findById(new ObjectId(id));
  if (link === null) {
    return notFound();
  }

  const path = `useful-links/${id}`;

  const mediaFile = await fetchMediaFile(path);
  if (mediaFile.ok) {
    // Even if we have a file in the storage, it might be stale.
    // Redownload the image if the elapsed time is more than INVALIDATE_TIME
    if (isTelegramUrl(link.href)) {
      // See media worker's OpenAPI
      const updatedOn = mediaFile.headers.get(MediaFileHeaders.UpdatedOn);

      if (updatedOn !== null) {
        const now = Date.now();
        const updatedOnEpoch = Date.parse(updatedOn);

        if (now - updatedOnEpoch < INVALIDATE_TIME) {
          return new NextResponse(mediaFile.body);
        }
      }
    } else {
      return new NextResponse(mediaFile.body);
    }
  }

  if (isTelegramUrl(link.href)) {
    const fileContent = await downloadChatImage(link.href);
    await putMediaFile(path, fileContent);

    return new NextResponse(fileContent);
  }

  return notFound();
}
