import { NextRequest, NextResponse } from 'next/server';

import { badRequest, notFound, ok } from '@/api/responses';
import { getScheduleForGroup } from '@/api/schedule/get';
import { normalizeGuid } from '@/utils/guid';
import { authRoute } from '@/api/authRoute';
import { UserRole } from '@data/types/user';
import { UpdateScheduleLinksPayload } from '@/api/schedule/types';

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
): payload is Partial<UpdateScheduleLinksPayload> {
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

  return authRoute(request, UserRole.GROUP_HEAD, async (repo) => {
    return await repo.transaction(async (trepo) => {
      const schedule = await trepo.schedule().findByGroup(group);

      if (schedule === null) {
        return notFound();
      }

      for (const week of schedule.weeks) {
        for (const { lessons } of week.days) {
          for (const lesson of lessons) {
            const id = `${lesson.type}-${lesson.name}-${lesson.teacher}`;
            const newLink = payload[id];

            if (newLink !== undefined) {
              lesson.link = newLink;
            }
          }
        }
      }

      return new NextResponse();
    });
  });
}
