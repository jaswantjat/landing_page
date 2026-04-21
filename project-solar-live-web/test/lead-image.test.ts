import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {
  buildLeadImagePayload,
  preferredLeadImageType,
  requestedLeadImageWidth
} from '../src/lib/lead-image.ts';

async function sampleLeadImage() {
  const buffer = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 3,
      background: { r: 32, g: 86, b: 190 }
    }
  })
    .png()
    .toBuffer();

  return {
    proposal_image_base64: buffer.toString('base64'),
    proposal_image_mime_type: 'image/png'
  };
}

test('requestedLeadImageWidth defaults and clamps to safe bounds', () => {
  assert.equal(requestedLeadImageWidth(null), 640);
  assert.equal(requestedLeadImageWidth('bad'), 640);
  assert.equal(requestedLeadImageWidth('120'), 240);
  assert.equal(requestedLeadImageWidth('3000'), 1024);
  assert.equal(requestedLeadImageWidth('480'), 480);
});

test('preferredLeadImageType prefers webp when browser supports it', () => {
  assert.equal(preferredLeadImageType('image/avif,image/webp,image/apng,*/*'), 'image/webp');
  assert.equal(preferredLeadImageType('image/png,image/*;q=0.8,*/*;q=0.5'), 'image/jpeg');
});

test('buildLeadImagePayload resizes and transcodes for modern browsers', async () => {
  const payload = await buildLeadImagePayload(await sampleLeadImage(), {
    acceptHeader: 'image/webp,image/apng,*/*',
    rawWidth: '360'
  });

  assert.ok(payload);
  assert.equal(payload?.contentType, 'image/webp');

  const metadata = await sharp(payload!.buffer).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 360);
  assert.equal(metadata.height, 360);
});

test('buildLeadImagePayload falls back to jpeg when webp is unavailable', async () => {
  const payload = await buildLeadImagePayload(await sampleLeadImage(), {
    acceptHeader: 'image/png,image/*;q=0.8,*/*;q=0.5',
    rawWidth: '640'
  });

  assert.ok(payload);
  assert.equal(payload?.contentType, 'image/jpeg');

  const metadata = await sharp(payload!.buffer).metadata();
  assert.equal(metadata.format, 'jpeg');
  assert.equal(metadata.width, 640);
  assert.equal(metadata.height, 640);
});
