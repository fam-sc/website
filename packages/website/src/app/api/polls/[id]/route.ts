import { authRoute } from '@/api/authRoute';
import { submitPollPayload } from '@/api/polls/types';
import { badRequest, notFound } from '@/api/responses';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

type RequestParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RequestParams) {
  const { id } = await params;

  const rawPayload = await request.json();
  const payloadResult = submitPollPayload.safeParse(rawPayload);
  if (payloadResult.error) {
    console.error(payloadResult.error);

    return badRequest();
  }

  return authRoute(request, UserRole.STUDENT, async (repo) => {
    const result = await repo.polls().addRespondent(id, {
      date: new Date(),
      answers: payloadResult.data.answers,
    });

    return result.modifiedCount === 0 ? notFound() : new NextResponse();
  });
}
