import { NextResponse } from 'next/server';
import { AIConciergeInputSchema, aiConciergeFlow } from '@/ai/flows/ai-concierge-flow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required.' }, { status: 400 });
  }

  const parsed = AIConciergeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a message of 1,000 characters or fewer.' }, { status: 400 });
  }

  try {
    const input = parsed.data;
    const result = await aiConciergeFlow(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI concierge request failed:', error);
    return NextResponse.json(
      { error: 'The AI concierge is temporarily unavailable.' },
      { status: 503 }
    );
  }
}
