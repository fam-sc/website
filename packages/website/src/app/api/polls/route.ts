import { addPollPayload } from '@/api/polls/types';
import { badRequest } from '@/api/responses';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawPayload = await request.json();
    const payload = addPollPayload.parse(rawPayload);

    await using repo = await Repository.openConnection();
    await repo.polls().insert({
      startDate: new Date(),
      endDate: null,
      respondents: [],
      ...payload
    });

    return new NextResponse();
  } catch (error) {
    if (error instanceof ZodError) {
      return badRequest();
    }

    throw error;
  }
}
