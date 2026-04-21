import { NextResponse } from 'next/server';
import { handleCampaignStatus } from '../../../../../src/lib/admin';
import { authorizedAdminRequest } from '../../../../../src/lib/admin-auth';
import { getNeighborhoodCampaignJobStatus } from '../../../../../src/lib/backend-jobs';

export async function GET(
  request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  if (!authorizedAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { jobId } = await context.params;
    const result = await handleCampaignStatus({ jobId }, { getNeighborhoodCampaignJobStatus });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
