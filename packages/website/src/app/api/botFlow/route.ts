import { NextRequest, NextResponse } from 'next/server';

import { getBotFlow, saveBotFlow } from '@/api/botFlow';
import { BotFlowWithInMeta } from '@/botFlow/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const flow = await getBotFlow();

  return new NextResponse(JSON.stringify(flow));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const flow = (await request.json()) as BotFlowWithInMeta;

  await saveBotFlow(flow);

  return new NextResponse();
}
