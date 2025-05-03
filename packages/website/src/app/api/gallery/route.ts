import { badRequest, ok } from '@/api/responses';
import { Repository } from '@/data/repo';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 20;

function parsePage(url: URL): number | null {
  const rawPage = url.searchParams.get('page');
  if (rawPage === null) {
    return 1;
  }

  const result = Number.parseInt(rawPage);
  if (Number.isNaN(result)) {
    return null;
  }

  return result;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const page = parsePage(url);
  if (page === null) {
    return badRequest({ message: 'Invalid page format' });
  }

  await using repo = await Repository.openConnection();
  const images = await repo.galleryImages().getPage(page, PAGE_SIZE);

  return ok(images);
}
