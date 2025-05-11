import { notFound } from '@/api/responses';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';

type RequestParams = { params: Promise<{ id: string }> };

export async function POST(
  _request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  const { id } = await params;

  await using repo = await Repository.openConnection();
  const { modifiedCount } = await repo.polls().closePoll(id);

  if (modifiedCount === 0) {
    return notFound();
  }

  return new NextResponse();
}
