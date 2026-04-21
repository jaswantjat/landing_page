import test from 'node:test';
import assert from 'node:assert/strict';
import { captureLeadSubmission } from '../src/lib/capture.ts';

const baseLead = {
  id: 'abc123',
  address: 'Carrer la Pau, 13',
  lat: 41.39,
  lon: 2.01,
  solar_data: {},
  panels_rec: 16,
  savings_eur: 2061,
  lead_name: null as string | null,
  lead_phone: null as string | null,
  priority_choice: null as string | null,
  monthly_bill_bracket: null as string | null,
  status: 'pdf_generated'
};

test('captureLeadSubmission updates DB and appends to sheets', async () => {
  const calls: string[] = [];
  const result = await captureLeadSubmission(
    { id: 'abc123', lead_name: 'Jane Doe', lead_phone: '+34600000001' },
    {
      findLeadById: async () => ({ ...baseLead }),
      updateCapturedLead: async () => { calls.push('db'); },
      appendCapturedLeadRow: async () => { calls.push('sheet'); }
    }
  );

  assert.deepEqual(calls, ['sheet', 'db']);
  assert.deepEqual(result, { ok: true, id: 'abc123' });
});

test('captureLeadSubmission throws when phone is missing', async () => {
  await assert.rejects(() =>
    captureLeadSubmission(
      { id: 'abc123', lead_name: 'Jane' },
      {
        findLeadById: async () => ({ ...baseLead }),
        updateCapturedLead: async () => {},
        appendCapturedLeadRow: async () => {}
      }
    )
  );
});

test('captureLeadSubmission throws when phone is too short', async () => {
  await assert.rejects(() =>
    captureLeadSubmission(
      { id: 'abc123', lead_phone: '123' },
      {
        findLeadById: async () => ({ ...baseLead }),
        updateCapturedLead: async () => {},
        appendCapturedLeadRow: async () => {}
      }
    )
  );
});

test('captureLeadSubmission throws Lead not found when lead does not exist', async () => {
  await assert.rejects(
    () =>
      captureLeadSubmission(
        { id: 'ghost-lead', lead_phone: '+34600000001' },
        {
          findLeadById: async () => null,
          updateCapturedLead: async () => {},
          appendCapturedLeadRow: async () => {}
        }
      ),
    /Lead not found/
  );
});

test('captureLeadSubmission stores null name when lead_name is absent', async () => {
  let capturedName: string | null = 'unset';

  await captureLeadSubmission(
    { id: 'abc123', lead_phone: '+34600000001' },
    {
      findLeadById: async () => ({ ...baseLead }),
      updateCapturedLead: async (_id, name, _phone) => { capturedName = name; },
      appendCapturedLeadRow: async () => {}
    }
  );

  assert.equal(capturedName, null);
});

test('captureLeadSubmission passes priority_choice and monthly_bill_bracket through', async () => {
  let capturedPriority: string | null = 'unset';
  let capturedBracket: string | null = 'unset';

  await captureLeadSubmission(
    { id: 'abc123', lead_phone: '+34600000001', priority_choice: 'savings', monthly_bill_bracket: '100-150' },
    {
      findLeadById: async () => ({ ...baseLead }),
      updateCapturedLead: async (_id, _name, _phone, priority, bracket) => {
        capturedPriority = priority;
        capturedBracket = bracket;
      },
      appendCapturedLeadRow: async () => {}
    }
  );

  assert.equal(capturedPriority, 'savings');
  assert.equal(capturedBracket, '100-150');
});

test('captureLeadSubmission stores null priority and bracket when absent', async () => {
  let capturedPriority: string | null = 'unset';
  let capturedBracket: string | null = 'unset';

  await captureLeadSubmission(
    { id: 'abc123', lead_phone: '+34600000001' },
    {
      findLeadById: async () => ({ ...baseLead }),
      updateCapturedLead: async (_id, _name, _phone, priority, bracket) => {
        capturedPriority = priority;
        capturedBracket = bracket;
      },
      appendCapturedLeadRow: async () => {}
    }
  );

  assert.equal(capturedPriority, null);
  assert.equal(capturedBracket, null);
});
