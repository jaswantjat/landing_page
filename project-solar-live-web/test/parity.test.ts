import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLeadPageModel } from '../src/lib/leads.ts';
import { buildLeadTemplateVars } from '../src/lib/template-vars.ts';

const baseLead = {
  id: 'parity-web-1',
  address: 'Carrer de Provença 321, 08037 Barcelona',
  lat: 41.39,
  lon: 2.16,
  solar_data: {},
  panels_rec: 8,
  savings_eur: 1800,
  lead_name: null,
  lead_phone: null,
  priority_choice: null,
  monthly_bill_bracket: null,
  status: 'pdf_generated',
  proposal_image_base64: null,
  proposal_image_mime_type: null,
  proposal_image_render_method: null,
};

const APP_BASE_URL = 'https://solar.example.com';

// ── QR target parity ──────────────────────────────────────────────────────────

test('loadLeadPageModel: vars.lead_url matches the URL a postcard QR would encode', async () => {
  const result = await loadLeadPageModel(baseLead.id, {
    findLeadById: async () => ({ ...baseLead }),
    appBaseUrl: APP_BASE_URL,
  });

  const expectedQrTarget = `${APP_BASE_URL}/p/${baseLead.id}`;
  assert.equal(result?.vars.lead_url, expectedQrTarget,
    'scanning the postcard QR must open the correct personalized landing page');
});

test('buildLeadTemplateVars: lead_url format is identical on web and backend for same lead', () => {
  // Backend formula: `${appBaseUrl.replace(/\/$/, '')}/p/${lead.id}`
  const vars = buildLeadTemplateVars(
    { ...baseLead },
    { appBaseUrl: APP_BASE_URL }
  );

  assert.equal(vars.lead_url, `${APP_BASE_URL}/p/${baseLead.id}`);
});

test('buildLeadTemplateVars: trailing slash in appBaseUrl does not break lead_url', () => {
  const vars = buildLeadTemplateVars(
    { ...baseLead },
    { appBaseUrl: `${APP_BASE_URL}/` }
  );

  assert.equal(vars.lead_url, `${APP_BASE_URL}/p/${baseLead.id}`);
});

// ── Cross-surface image parity ────────────────────────────────────────────────

test('loadLeadPageModel: proposalImageUrl matches what the postcard embeds for same lead', async () => {
  const imageBase64 = Buffer.from('canonical-image-data').toString('base64');
  const mimeType = 'image/png';
  const lead = { ...baseLead, proposal_image_base64: imageBase64, proposal_image_mime_type: mimeType };

  const result = await loadLeadPageModel(lead.id, {
    findLeadById: async () => ({ ...lead }),
    appBaseUrl: APP_BASE_URL,
  });

  // Landing page serves the image via the /api/image/:id route to avoid embedding base64 in HTML
  const expectedImageUrl = `/api/image/${lead.id}`;

  assert.equal(result?.proposalImageUrl, expectedImageUrl,
    'landing page proposalImageUrl must be the image API route, not an inline data URI');
  assert.equal(result?.vars.proposal_image_url, expectedImageUrl,
    'landing page template vars must carry the API image URL');
});

test('loadLeadPageModel: proposal_image_url is null when no stored image — matches postcard behaviour', async () => {
  const result = await loadLeadPageModel(baseLead.id, {
    findLeadById: async () => ({ ...baseLead }),
    appBaseUrl: APP_BASE_URL,
  });

  assert.equal(result?.proposalImageUrl, null);
  assert.equal(result?.vars.proposal_image_url, null);
});

test('loadLeadPageModel: vars.lead_url and proposalImageUrl are stable across repeated loads', async () => {
  const imageBase64 = Buffer.from('stable-image').toString('base64');
  const lead = { ...baseLead, proposal_image_base64: imageBase64, proposal_image_mime_type: 'image/png' };

  const [r1, r2] = await Promise.all([
    loadLeadPageModel(lead.id, { findLeadById: async () => ({ ...lead }), appBaseUrl: APP_BASE_URL }),
    loadLeadPageModel(lead.id, { findLeadById: async () => ({ ...lead }), appBaseUrl: APP_BASE_URL }),
  ]);

  assert.equal(r1?.vars.lead_url, r2?.vars.lead_url, 'lead_url must be deterministic');
  assert.equal(r1?.vars.proposal_image_url, r2?.vars.proposal_image_url, 'proposal_image_url must be deterministic');
});
