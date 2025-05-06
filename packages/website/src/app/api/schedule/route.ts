import { NextRequest, NextResponse } from 'next/server';

import { badRequest, notFound, ok } from '@/api/responses';
import { getScheduleForGroup } from '@/api/schedule/get';
import { normalizeGuid } from '@/utils/guid';
import {
  ScheduleNotFoundError,
  updateScheduleLinks,
  UpdateScheduleLinksPayload,
} from '@/api/schedule/update';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const group = searchParams.get('group');
  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  const result = await getScheduleForGroup(normalizeGuid(group));

  return ok(result);
}

function isValidPayload(
  payload: unknown
): payload is UpdateScheduleLinksPayload {
  if (typeof payload === 'object') {
    for (const value of Object.values(payload as object)) {
      if (typeof value !== 'string' && value !== null) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const group = searchParams.get('group');

  if (group === null) {
    return badRequest({ message: 'No group parameter' });
  }

  if (type !== 'link') {
    return badRequest({ message: 'Invalid type' });
  }

  const payload = await request.json();
  if (!isValidPayload(payload)) {
    return badRequest({ message: 'Invalid payload' });
  }

  try {
    await updateScheduleLinks(group, payload);
  } catch (error: unknown) {
    if (error instanceof ScheduleNotFoundError) {
      return notFound();
    }

    throw error;
  }

  return new NextResponse();
}
