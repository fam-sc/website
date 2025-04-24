import { NextRequest, NextResponse } from 'next/server';

import { badRequest, ok } from '@/api/responses';
import { getScheduleForGroup } from '@/api/schedule';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  const result = await getScheduleForGroup(group);

  return ok(result);
}
