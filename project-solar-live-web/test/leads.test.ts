import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLeadPageModel } from '../src/lib/leads.ts';

const baseLead = {
  id: 'abc123',
  address: 'Carrer la Pau, 13',
  lat: 41.39,
  lon: 2.01,
  solar_data: {},
  panels_rec: 16,
  savings_eur: 2061,
  lead_name: null,
  lead_phone: null,
  priority_choice: null,
  monthly_bill_bracket: null,
  status: 'pdf_generated',
  proposal_image_base64: null,
  proposal_image_mime_type: null,
  proposal_image_render_method: null,
};

test('loadLeadPageModel returns null when lead does not exist', async () => {
  const result = await loadLeadPageModel('missing', { findLeadById: async () => null });
  assert.equal(result, null);
});

test('loadLeadPageModel returns null proposalImageUrl when no stored image', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({ ...baseLead })
  });
  assert.equal(result?.proposalImageUrl, null);
  assert.equal(result?.lead.id, 'abc123');
});

test('loadLeadPageModel uses stored canonical image', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({
      ...baseLead,
      proposal_image_base64: 'abc==',
      proposal_image_mime_type: 'image/png'
    })
  });
  assert.equal(result?.proposalImageUrl, '/api/image/abc123');
  assert.equal(result?.lead.id, 'abc123');
});

test('loadLeadPageModel returns vars with all required contract fields', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({ ...baseLead }),
    appBaseUrl: 'https://example.com',
  });
  assert.ok(result?.vars, 'vars must be present');
  const vars = result!.vars;
  assert.equal(vars.lead_id, 'abc123');
  assert.equal(vars.lead_url, 'https://example.com/p/abc123');
  assert.equal(vars.address_full, 'Carrer la Pau, 13');
  assert.equal(vars.address_line_1, 'Carrer la Pau');
  assert.equal(vars.address_line_2, '13');
  assert.equal(vars.location_label, 'Carrer la Pau');
  assert.equal(vars.annual_savings_eur, 2061);
  assert.equal(vars.panels_recommended, 16);
  assert.equal(vars.lead_name, null);
  assert.equal(vars.lead_phone, null);
  assert.equal(vars.priority_choice, null);
  assert.equal(vars.monthly_bill_bracket, null);
  assert.equal(vars.proposal_image_url, null);
  assert.equal(vars.qr_data_url, null);
  assert.ok(typeof vars.reference_code === 'string', 'reference_code must be a string');
  assert.ok(typeof vars.valid_until === 'string', 'valid_until must be a string');
  assert.ok(typeof vars.projected_monthly_bill === 'number', 'projected_monthly_bill must be a number');
});

test('loadLeadPageModel location_label strips the country and prefers the neighborhood', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({
      ...baseLead,
      address: "Carrer d'August Font, 45, Sarrià-Sant Gervasi, 08035 Barcelona, Spain",
    }),
    appBaseUrl: 'https://example.com',
  });

  assert.equal(result?.vars.location_label, 'Sarrià-Sant Gervasi');
});

test('loadLeadPageModel vars.lead_url includes appBaseUrl', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({ ...baseLead }),
    appBaseUrl: 'https://solar.example.com',
  });
  assert.equal(result?.vars.lead_url, 'https://solar.example.com/p/abc123');
});

test('loadLeadPageModel vars.proposal_image_url is API URL when stored image exists', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({
      ...baseLead,
      proposal_image_base64: 'abc==',
      proposal_image_mime_type: 'image/png',
    }),
    appBaseUrl: 'https://example.com',
  });
  assert.equal(result?.vars.proposal_image_url, '/api/image/abc123');
});

test('loadLeadPageModel vars.proposal_image_url matches proposalImageUrl', async () => {
  const result = await loadLeadPageModel('abc123', {
    findLeadById: async () => ({
      ...baseLead,
      proposal_image_base64: 'abc==',
      proposal_image_mime_type: 'image/png',
    }),
    appBaseUrl: 'https://example.com',
  });
  assert.equal(result?.vars.proposal_image_url, result?.proposalImageUrl);
});
