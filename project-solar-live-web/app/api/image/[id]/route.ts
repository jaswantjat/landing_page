import { NextRequest, NextResponse } from 'next/server';
import { findLeadById } from '../../../../src/lib/db';
import { buildLeadImagePayload } from '../../../../src/lib/lead-image';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = await findLeadById(id);
  const image = await buildLeadImagePayload(lead ?? {
    proposal_image_base64: null,
    proposal_image_mime_type: null,
  }, {
    acceptHeader: req.headers.get('accept') ?? '',
    rawWidth: req.nextUrl.searchParams.get('w'),
  });

  if (!image) {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(new Uint8Array(image.buffer), {
    status: 200,
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Vary': 'Accept',
    },
  });
}
