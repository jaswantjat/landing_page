import sharp from 'sharp';

const DEFAULT_WIDTH = 640;
const MIN_WIDTH = 240;
const MAX_WIDTH = 1024;

export interface LeadImageSource {
  proposal_image_base64: string | null;
  proposal_image_mime_type: string | null;
}

export function requestedLeadImageWidth(rawWidth: string | null): number {
  if (!rawWidth) return DEFAULT_WIDTH;
  const parsed = Number.parseInt(rawWidth, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_WIDTH;
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed));
}

export function preferredLeadImageType(acceptHeader: string): 'image/webp' | 'image/jpeg' {
  return acceptHeader.includes('image/webp') ? 'image/webp' : 'image/jpeg';
}

export async function buildLeadImagePayload(
  lead: LeadImageSource,
  options: {
    acceptHeader: string;
    rawWidth: string | null;
  }
): Promise<{ buffer: Buffer; contentType: 'image/webp' | 'image/jpeg' } | null> {
  if (!lead.proposal_image_base64 || !lead.proposal_image_mime_type) {
    return null;
  }

  const width = requestedLeadImageWidth(options.rawWidth);
  const contentType = preferredLeadImageType(options.acceptHeader);
  const sourceBuffer = Buffer.from(lead.proposal_image_base64, 'base64');
  let pipeline = sharp(sourceBuffer).rotate().resize({
    width,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const buffer =
    contentType === 'image/webp'
      ? await pipeline.webp({ quality: 72 }).toBuffer()
      : await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();

  return { buffer, contentType };
}
