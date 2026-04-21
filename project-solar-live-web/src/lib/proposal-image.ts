import sharp from 'sharp';
import {
  decodeGeoTiffBuffer,
  fetchDataLayers,
  fetchSolarGeoTiffBuffer,
  prepareRoofImage
} from '@project-solar/shared-solar-core';

const LEGACY_PROPOSAL_PROMPT = "Transform this into a photo-realistic drone shot without changing the core image. Add a just a few solar panels to the roof, outline just the house's boundary with a blue highlight";
const DEFAULT_RENDER_MODEL = 'wavespeed-ai/flux-2-klein-9b/edit';
const DEFAULT_RENDER_SEED = 122200937;

async function baseRoofImageBuffer(lat: number, lon: number, solarData: any): Promise<Buffer> {
  const dataLayers = await fetchDataLayers({
    lat,
    lon,
    apiKey: process.env.GOOGLE_SOLAR_API_KEY || ''
  });
  if (!dataLayers.rgbUrl) throw new Error('Google Solar dataLayers response missing rgbUrl');

  const tiffBuffer = await fetchSolarGeoTiffBuffer(dataLayers.rgbUrl);
  const decoded = await decodeGeoTiffBuffer(tiffBuffer);
  const prepared = prepareRoofImage({
    decodedImage: decoded,
    solarPotential: solarData.solarPotential,
    boundingBox: solarData.boundingBox,
    targetWidth: 396,
    targetHeight: 440
  });

  return sharp(Buffer.from(prepared.rgb), {
    raw: { width: prepared.width, height: prepared.height, channels: 3 }
  })
    .extract({
      left: prepared.cropRect.x,
      top: prepared.cropRect.y,
      width: prepared.cropRect.width,
      height: prepared.cropRect.height
    })
    .resize(prepared.targetWidth, prepared.targetHeight)
    .png()
    .toBuffer();
}

export async function generateLeadProposalImage(lead: { address: string; lat: number; lon: number; solar_data: any }) {
  const solarData = lead.solar_data || {};
  const roofLat = solarData?.center?.latitude ?? lead.lat;
  const roofLon = solarData?.center?.longitude ?? lead.lon;
  const baseImageBuffer = await baseRoofImageBuffer(roofLat, roofLon, solarData);
  const response = await fetch(`${(process.env.RENDERER_URL || '').replace(/\/$/, '')}/solar-rgb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.RENDERER_API_KEY ? { 'X-API-KEY': process.env.RENDERER_API_KEY } : {})
    },
    body: JSON.stringify({
      lat: roofLat,
      lon: roofLon,
      address: lead.address,
      model: DEFAULT_RENDER_MODEL,
      prompt: LEGACY_PROPOSAL_PROMPT,
      seed: DEFAULT_RENDER_SEED,
      targetResolution: '2K',
      imageMimeType: 'image/png',
      baseImageBase64: baseImageBuffer.toString('base64')
    })
  });

  if (!response.ok) throw new Error(`Renderer request failed: ${response.status} ${response.statusText}`);
  const payload = await response.json();
  if (!payload.imageBase64) throw new Error('Renderer returned no image');
  return `data:image/png;base64,${payload.imageBase64}`;
}
