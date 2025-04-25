import { NextRequest, NextResponse } from 'next/server';

import { badRequest, ok } from '@/api/responses';
import { getScheduleForGroup } from '@/api/schedule';
import { normalizeGuid } from '@/utils/guid';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  const result = await getScheduleForGroup(normalizeGuid(group));

  return ok(result);
}
