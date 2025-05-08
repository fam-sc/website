import { submitPollPayload } from '@/api/polls/types';
import { badRequest, notFound } from '@/api/responses';
import { Repository } from '@data/repo';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

type RequestParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RequestParams) {
  try {
    const { id } = await params;

    const rawPayload = await request.json();
    const payload = submitPollPayload.parse(rawPayload);

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return notFound();
    }

    await using repo = await Repository.openConnection();
    const result = await repo
      .polls()
      .addRespondent(objectId, { date: new Date(), answers: payload.answers });

    if (result.modifiedCount === 0) {
      return notFound();
    }

    return new NextResponse();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return badRequest();
    }

    throw error;
  }
}
