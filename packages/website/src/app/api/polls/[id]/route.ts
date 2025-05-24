import { authRoute } from '@/api/authRoute';
import { ApiErrorCode } from '@/api/errorCodes';
import { submitPollPayload } from '@/api/polls/types';
import { badRequest, notFound } from '@/api/responses';
import { UserRole } from '@data/types/user';
import { ObjectId } from 'mongodb';
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

  return authRoute(request, UserRole.STUDENT, async (repo, userId) => {
    return await repo.transaction(async (trepo) => {
      const poll = await trepo.polls().findPollWithEndDateAndAnswers(id);
      if (poll === null) {
        return notFound();
      }

      if (poll.endDate !== null) {
        return badRequest({
          message: 'Poll is closed',
          code: ApiErrorCode.POLL_CLOSED,
        });
      }

      const objectUserId = new ObjectId(userId);
      const userResponded = poll.respondents.find(
        (respondent) => respondent.userId === objectUserId
      );

      if (userResponded) {
        return badRequest({ message: 'The user has already responded' });
      }

      await trepo.polls().addRespondent(id, {
        userId: objectUserId,
        date: new Date(),
        answers: payloadResult.data.answers,
      });

      return new NextResponse();
    });
  });
}
