import { notFound, ok } from '@/api/responses';
import { IdRequestProps } from '@/types/next';
import { pollResultsToTable } from '@/utils/polls/table';
import { Repository } from '@data/repo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: IdRequestProps
): Promise<NextResponse> {
  const { id } = await params;

  await using repo = await Repository.openConnection();
  const poll = await repo.polls().findPollWithQuestionsAndAnswers(id);

  if (poll === null) {
    return notFound();
  }

  const table = pollResultsToTable(poll.questions, poll.respondents);

  return ok(table);
}
