import { NextResponse } from 'next/server';
import { authorizedAdminRequest } from '../../../../src/lib/admin-auth';
import { submitSingleLeadJob } from '../../../../src/lib/backend-jobs';

export async function POST(request: Request) {
  if (!authorizedAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const lat = Number(body?.lat);
    const lon = Number(body?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ ok: false, error: 'lat and lon are required' }, { status: 400 });
    }
    const result = await submitSingleLeadJob(lat, lon);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
