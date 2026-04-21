import test from 'node:test';
import assert from 'node:assert/strict';
import { projectedMonthlyBill } from '../src/lib/lead-economics.ts';

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
  status: 'pdf_generated',
  proposal_image_base64: null,
  proposal_image_mime_type: null,
  proposal_image_render_method: null
};

test('projectedMonthlyBill prefers stored eligibility projection', () => {
  const amount = projectedMonthlyBill({
    ...baseLead,
    solar_data: {
      pipeline: {
        eligibility: {
          projectedMonthlyBill: 37.5
        }
      }
    }
  });

  assert.equal(amount, 37.5);
});

test('projectedMonthlyBill derives a fallback from annual savings when projection is absent', () => {
  const amount = projectedMonthlyBill(baseLead);
  assert.equal(amount > 0, true);
  assert.equal(amount < baseLead.savings_eur / 12, true);
});
