import { NextResponse } from 'next/server';

import { ok } from '@/api/responses';
import { getFacultyGroups } from '@/api/schedule';
import { shortenGuid } from '@/utils/guid';

export async function GET(): Promise<NextResponse> {
  const result = await getFacultyGroups();
  result.sort((a, b) => a.name.localeCompare(b.name, 'uk-UA'));

  return ok(
    result.map((item) => ({
      campusId: shortenGuid(item.campusId),
      name: item.name,
    }))
  );
}
