import { NextResponse } from 'next/server';

import { ok } from '@/api/responses';
import { getFacultyGroups } from '@/api/schedule';

export async function GET(): Promise<NextResponse> {
  const result = await getFacultyGroups();

  return ok(result);
}
