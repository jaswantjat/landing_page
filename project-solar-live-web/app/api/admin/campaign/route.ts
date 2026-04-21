import { NextResponse } from 'next/server';
import { handleCampaignStart } from '../../../../src/lib/admin';
import { authorizedAdminRequest } from '../../../../src/lib/admin-auth';
import { startNeighborhoodCampaignJob } from '../../../../src/lib/backend-jobs';

export async function POST(request: Request) {
  if (!authorizedAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const result = await handleCampaignStart(body, { startNeighborhoodCampaignJob });
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
