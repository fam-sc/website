import { authRoute } from '@/api/authRoute';
import { addPollPayload } from '@/api/polls/types';
import { badRequest } from '@/api/responses';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawPayload = await request.json();
  const payloadResult = addPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    await repo.polls().insert({
      startDate: new Date(),
      endDate: null,
      respondents: [],
      ...payloadResult.data,
    });

    return new NextResponse();
  });
}
