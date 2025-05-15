import { authRoute } from '@/api/authRoute';
import { notFound, ok } from '@/api/responses';
import { IdRequestProps } from '@/types/next';
import { pollResultsToTable } from '@/utils/polls/table';
import { UserRole } from '@data/types/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: IdRequestProps
): Promise<NextResponse> {
  const { id } = await params;

  return authRoute(request, UserRole.ADMIN, async (repo) => {
    const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

    if (poll === null) {
      return notFound();
    }

    return ok(pollResultsToTable(poll.questions, poll.respondents));
  });
}
