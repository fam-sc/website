import { authRoute } from '@/api/authRoute';
import { notFound } from '@/api/responses';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

type RequestParams = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  { params }: RequestParams
): Promise<NextResponse> {
  const { id } = await params;

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const { matchedCount } = await repo.polls().closePoll(id);

    return matchedCount === 0 ? notFound() : new NextResponse();
  });
}
