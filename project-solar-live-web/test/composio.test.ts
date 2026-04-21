import test from 'node:test';
import assert from 'node:assert/strict';
import { appendCapturedLeadRow } from '../src/lib/composio.ts';

test('appendCapturedLeadRow uses Composio MCP search and append flow', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];

  process.env.COMPOSIO_MCP_URL = 'https://connect.composio.dev/mcp';
  process.env.COMPOSIO_CONSUMER_API_KEY = 'ck_test';
  process.env.GOOGLE_SHEET_ID = 'sheet_123456789012345678901234567890';
  process.env.GOOGLE_SHEET_RANGE = 'Sheet1!A:H';

  global.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body));
    calls.push({ name: body.params.name, args: body.params.arguments });

    if (body.params.name === 'COMPOSIO_SEARCH_TOOLS') {
      return new Response(
        'event: message\n' +
        'data: {"result":{"content":[{"type":"text","text":"{\\"data\\":{\\"results\\":[{\\"primary_tool_slugs\\":[\\"GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND\\"]}],\\"session\\":{\\"id\\":\\"find\\"}}}"}]}}\n\n',
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
      );
    }

    return new Response(
      'event: message\n' +
      'data: {"result":{"content":[{"type":"text","text":"{\\"successful\\":true,\\"data\\":{\\"results\\":[{\\"response\\":{\\"successful\\":true}}]}}"}]}}\n\n',
      { status: 200, headers: { 'Content-Type': 'text/event-stream' } }
    );
  };

  const result = await appendCapturedLeadRow(
    {
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
      status: 'pdf_generated'
    },
    { leadName: 'Jane Doe', leadPhone: '+34600000001', priorityChoice: 'savings', monthlyBillBracket: '100-150' }
  );

  assert.equal(calls.length, 2);
  assert.equal(calls[0].name, 'COMPOSIO_SEARCH_TOOLS');
  assert.equal(calls[1].name, 'COMPOSIO_MULTI_EXECUTE_TOOL');
  assert.equal(calls[1].args.session_id, 'find');
  assert.equal(
    calls[1].args.tools?.[0]?.arguments?.spreadsheetId,
    'sheet_123456789012345678901234567890'
  );
  assert.equal(
    calls[1].args.tools?.[0]?.arguments?.range,
    'Sheet1!A:H'
  );
  assert.equal(result.successful, true);

  global.fetch = originalFetch;
  process.env = originalEnv;
});
