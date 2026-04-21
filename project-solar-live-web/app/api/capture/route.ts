import { NextResponse } from 'next/server';
import { appendCapturedLeadRow } from '../../../src/lib/composio';
import { captureLeadSubmission } from '../../../src/lib/capture';
import { findLeadById, updateCapturedLead } from '../../../src/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await captureLeadSubmission(body, {
      findLeadById,
      updateCapturedLead,
      appendCapturedLeadRow
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
